import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Subscription active</h1>
      <p className="text-gray-600">Welcome in. Your access is unlocked.</p>
      <Link href="/communities" className="text-sm font-semibold text-blue-600">
        Go to communities
      </Link>
    </div>
  );
}
