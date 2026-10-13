import { Suspense } from "react";
import Assessment from "@/components/Assessment";

export default function Home() {
  // Assessment reads ?result&id= from the URL, which needs a Suspense boundary to prerender.
  return (
    <Suspense>
      <Assessment />
    </Suspense>
  );
}
