"use client";

import { useParams } from "next/navigation";
import ReconcileDetailsViewer from "@/components/dashboard/ReconcileDetailsViewer";

export default function ReconcileResultsPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  return <ReconcileDetailsViewer jobId={jobId} />;
}
