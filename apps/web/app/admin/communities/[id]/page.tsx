"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CommunityForm } from "@components/admin/community-form";
import { CommunityService } from "@services/community.service";
import type { Community } from "@interfaces/community.interface";
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

function toFormValues(community: Community): ICommunityFormValues {
  return {
    title: community.title,
    slug: community.slug || "",
    description: community.description || "",
    isFree: community.isFree,
    priceMonthly: community.priceMonthly || 49,
    isPublished: community.isPublished,
    isFeatured: community.isFeatured,
    sortOrder: community.sortOrder || 0,
    coverImageUrl: community.coverImageUrl || "",
  };
}

export default function EditCommunityPage(): JSX.Element {
  const params = useParams();
  const id = params.id as string;
  const [values, setValues] = useState<ICommunityFormValues>(DEFAULT_VALUES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CommunityService.getAdminById(id)
      .then((community) => setValues(toFormValues(community)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (nextValues: ICommunityFormValues): Promise<void> => {
    try {
      await CommunityService.update(id, nextValues);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update community");
    }
  };

  if (loading) {
    return <div className="py-12 text-sm text-gray-500">Loading community...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit community</h1>
      <CommunityForm
        initialValues={values}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
