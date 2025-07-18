import { QuickStats } from "@/types/common";
import { Job } from "@/types/job";

export default function getQuickStats(
  jobs: Job[]
): QuickStats {
  const quickStats: QuickStats = {
    'Not Applied': 0,
    'Applied': 0,
    'Assessment': 0,
    'Interview': 0,
    'Job Offered': 0,
    'Accepted Offer': 0,
    'Declined Offer': 0,
    'Rejected': 0,
    'Ghosted': 0,
    'Closed': 0
  }

  for (const job of jobs) {
    quickStats[job.job_status as keyof QuickStats] += 1
  }

  return quickStats;
}