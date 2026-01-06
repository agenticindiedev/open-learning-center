import Link from "next/link";

export default function LessonsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
      <p className="text-gray-600">Pick a course to view lessons.</p>
      <Link href="/courses" className="text-sm font-semibold text-blue-600">
        Go to courses
      </Link>
    </div>
  );
}
