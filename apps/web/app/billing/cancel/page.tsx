import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Checkout canceled</h1>
      <p className="text-gray-600">No charge was made.</p>
      <Link href="/communities" className="text-sm font-semibold text-blue-600">
        Back to communities
      </Link>
    </div>
  );
}
