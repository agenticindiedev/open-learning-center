import Link from "next/link";

export default function MembershipsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Memberships</h1>
      <p className="text-gray-600">Manage memberships from the admin dashboard.</p>
      <Link href="/admin" className="text-sm font-semibold text-blue-600">
        Go to admin
      </Link>
    </div>
  );
}
