import Link from "next/link";

export default function ProgressPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
      <p className="text-gray-600">Your progress is tracked inside lessons.</p>
      <Link href="/communities" className="text-sm font-semibold text-blue-600">
        Browse communities
      </Link>
    </div>
  );
}
