import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { verifyToken } from "@clerk/backend";
import { ConfigService } from "../../config/config.service";

@Injectable()
export class OptionalClerkAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      request.user = undefined;
      return true;
    }

    const token = authHeader.replace("Bearer ", "");
    const clerkSecretKey = this.configService.get("CLERK_SECRET_KEY");

    try {
      const session = await verifyToken(token, {
        secretKey: clerkSecretKey || "",
      });
      request.user = {
        userId: session.sub,
        sessionId: session.sid,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
