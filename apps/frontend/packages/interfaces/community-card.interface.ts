import type { Community } from "@interfaces/community.interface";

export interface ICommunityCardProps {
  community: Community;
  isSubscribed: boolean;
  joinedIds: Set<string>;
  onJoin: (communityId: string) => Promise<void>;
  onSubscribe: () => Promise<void>;
}
