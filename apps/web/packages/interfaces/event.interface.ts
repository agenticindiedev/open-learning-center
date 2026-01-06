export interface Event {
  _id: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  meetUrl: string;
  communityId?: string;
  isPaidOnly: boolean;
  isPublished: boolean;
}
