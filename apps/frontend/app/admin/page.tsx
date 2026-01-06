import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
        <p className="mt-2 text-gray-600">Manage communities, courses, and lessons.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/communities"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          Communities
        </Link>
        <Link
          href="/admin/courses"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          Courses
        </Link>
        <Link
          href="/admin/lessons"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          Lessons
        </Link>
        <Link
          href="/admin/events"
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          Events
        </Link>
      </div>
    </div>
  );
}
