import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { createClerkClient } from "@clerk/backend";
import { ConfigService } from "../../config/config.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      throw new UnauthorizedException("No authenticated user");
    }

    const allowlist = (this.configService.get("ADMIN_EMAIL_ALLOWLIST") || "")
      .split(",")
      .map((email: string) => email.trim().toLowerCase())
      .filter(Boolean);

    if (allowlist.length === 0) {
      throw new ForbiddenException("Admin allowlist is empty");
    }

    const clerkSecretKey = this.configService.get("CLERK_SECRET_KEY");
    const clerk = createClerkClient({ secretKey: clerkSecretKey });
    const user = await clerk.users.getUser(userId);
    const primaryEmail = user.emailAddresses.find((email: { id: string; emailAddress: string }) => email.id === user.primaryEmailAddressId)
      ?.emailAddress;
    const fallbackEmail = user.emailAddresses[0]?.emailAddress;
    const email = (primaryEmail || fallbackEmail || "").toLowerCase();

    if (!email || !allowlist.includes(email)) {
      throw new ForbiddenException("Admin access required");
    }

    return true;
  }
}
