import CourseDetailClient from "./course-detail-client";

/** Required for `output: "export"` — real course data still loads from the API at runtime. */
export function generateStaticParams() {
  return [{ slug: "preview" }];
}

export default function CourseDetailPage() {
  return <CourseDetailClient />;
}
