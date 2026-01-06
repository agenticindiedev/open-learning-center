import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Clerk } from "@clerk/clerk-sdk-node";

@Injectable()
export class OptionalClerkAuthGuard implements CanActivate {
  private clerk: Clerk;

  constructor() {
    this.clerk = new Clerk({
      secretKey: process.env.CLERK_SECRET_KEY || "",
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      request.user = undefined;
      return true;
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const session = await this.clerk.verifyToken(token);
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
