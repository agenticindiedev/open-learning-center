import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { verifyToken } from "@clerk/backend";
import { ConfigService } from "../../config/config.service";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("No authorization token provided");
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
