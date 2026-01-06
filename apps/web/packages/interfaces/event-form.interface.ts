import type { Community } from "@interfaces/community.interface";

export interface IEventFormValues {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  meetUrl: string;
  communityId: string;
  isPaidOnly: boolean;
  isPublished: boolean;
}

export interface IEventFormProps {
  initialValues: IEventFormValues;
  communities: Community[];
  submitLabel: string;
  onSubmit: (values: IEventFormValues) => Promise<void>;
}
