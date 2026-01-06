"use client";

import { useRouter } from "next/navigation";
import { CommunityForm } from "@components/admin/community-form";
import { CommunityService } from "@services/community.service";
import type { ICommunityFormValues } from "@interfaces/community-form.interface";

const DEFAULT_VALUES: ICommunityFormValues = {
  title: "",
  slug: "",
  description: "",
  isFree: false,
  priceMonthly: 49,
  isPublished: false,
  isFeatured: false,
  sortOrder: 0,
  coverImageUrl: "",
};

export default function NewCommunityPage(): JSX.Element {
  const router = useRouter();

  const handleSubmit = async (values: ICommunityFormValues): Promise<void> => {
    const created = await CommunityService.create(values);
    router.push(`/admin/communities/${created._id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">New community</h1>
      <CommunityForm
        initialValues={DEFAULT_VALUES}
        submitLabel="Create community"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
