import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Clerk } from "@clerk/clerk-sdk-node";

@Injectable()
export class AdminGuard implements CanActivate {
  private clerk: Clerk;

  constructor() {
    this.clerk = new Clerk({
      secretKey: process.env.CLERK_SECRET_KEY || "",
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      throw new UnauthorizedException("No authenticated user");
    }

    const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (allowlist.length === 0) {
      throw new ForbiddenException("Admin allowlist is empty");
    }

    const user = await this.clerk.users.getUser(userId);
    const primaryEmail = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
      ?.emailAddress;
    const fallbackEmail = user.emailAddresses[0]?.emailAddress;
    const email = (primaryEmail || fallbackEmail || "").toLowerCase();

    if (!email || !allowlist.includes(email)) {
      throw new ForbiddenException("Admin access required");
    }

    return true;
  }
}
