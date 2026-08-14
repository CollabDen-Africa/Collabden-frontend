import { DisputeDetails } from "@/components/features/admin/disputes/DisputeDetails";

export default async function DisputeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DisputeDetails id={id} />;
}
