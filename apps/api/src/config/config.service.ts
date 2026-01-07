import * as dotenv from "dotenv";
import * as fs from "fs";
import * as Joi from "joi";
import * as path from "path";
import type { IEnvConfig } from "./env-config.interface";

export class ConfigService {
  private readonly envConfig: IEnvConfig;

  constructor() {
    // Start with process.env as base (Docker Compose injects env_file vars here)
    let config: Record<string, any> = { ...process.env };

    // Find directories by walking up from cwd to find package.json files
    const cwd = process.cwd();
    const apiDir = this.findApiDir(cwd);
    const monorepoRoot = this.findMonorepoRoot(apiDir);

    // Determine which env files to load based on NODE_ENV
    const env = process.env.NODE_ENV;
    const isProduction = env === "production";
    const isTest = env === "test";

    // Build absolute paths for env files
    // In development: root/.env, root/.env.local, apps/api/.env, apps/api/.env.local
    // In production: root/.env.production, apps/api/.env.production
    // In test: root/.env.test, apps/api/.env.test
    const envFiles = isProduction
      ? [path.join(monorepoRoot, ".env.production"), path.join(apiDir, ".env.production")]
      : isTest
        ? [path.join(monorepoRoot, ".env.test"), path.join(apiDir, ".env.test")]
        : [
            path.join(monorepoRoot, ".env"),
            path.join(monorepoRoot, ".env.local"),
            path.join(apiDir, ".env"),
            path.join(apiDir, ".env.local"),
          ];

    // Load each env file in order (later files override earlier ones)
    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        const envConfig = dotenv.parse(fs.readFileSync(envFile));
        config = { ...config, ...envConfig };
      }
    }

    this.envConfig = this.validateInput(config as IEnvConfig);
  }

  private findApiDir(startDir: string): string {
    let dir = startDir;
    // Walk up looking for package.json with name containing "api"
    while (dir !== path.dirname(dir)) {
      const pkgPath = path.join(dir, "package.json");
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
          if (pkg.name?.includes("api")) {
            return dir;
          }
        } catch {}
      }
      dir = path.dirname(dir);
    }
    // Fallback to cwd
    return startDir;
  }

  private findMonorepoRoot(startDir: string): string {
    let dir = startDir;
    // Walk up looking for package.json with workspaces
    while (dir !== path.dirname(dir)) {
      const pkgPath = path.join(dir, "package.json");
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
          if (pkg.workspaces) {
            return dir;
          }
        } catch {}
      }
      dir = path.dirname(dir);
    }
    // Fallback: go up 2 levels from api dir
    return path.resolve(startDir, "../..");
  }

  public get<K extends keyof IEnvConfig>(key: K): IEnvConfig[K] {
    return this.envConfig[key];
  }

  public getOptional<K extends keyof IEnvConfig>(key: K): IEnvConfig[K] | undefined {
    return this.envConfig[key];
  }

  private validateInput(envConfig: IEnvConfig): IEnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      PORT: Joi.number().default(3010),

      NODE_ENV: Joi.string()
        .valid("development", "staging", "production", "test")
        .default("development"),

      // MongoDB
      MONGODB_URI: Joi.string().default("mongodb://localhost/api"),

      // Stripe
      STRIPE_SECRET_KEY: Joi.string().required(),
      STRIPE_PRICE_ID: Joi.string().optional().allow(""),
      STRIPE_WEBHOOK_SECRET: Joi.string().optional().allow(""),

      // Clerk
      CLERK_SECRET_KEY: Joi.string().required(),

      // Admin
      ADMIN_EMAIL_ALLOWLIST: Joi.string().optional().allow(""),

      // App URLs
      APP_URL: Joi.string().optional().allow(""),
      NEXT_PUBLIC_APP_URL: Joi.string().optional().allow(""),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig, {
      allowUnknown: true, // Allow unknown env vars (like NVM_INC) in all environments
      stripUnknown: false, // Keep unknown vars for debugging
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig as IEnvConfig;
  }

  get isDevelopment(): boolean {
    return Boolean(this.envConfig.NODE_ENV === "development");
  }

  get isStaging(): boolean {
    return Boolean(this.envConfig.NODE_ENV === "staging");
  }

  get isProduction(): boolean {
    return Boolean(this.envConfig.NODE_ENV === "production");
  }

  get mongoURL(): string {
    return this.envConfig.MONGODB_URI;
  }
}
