export interface Membership {
  _id: string;
  userId: string;
  communityId: string;
  status: string;
  source: string;
  joinedAt: string;
  canceledAt?: string;
}
