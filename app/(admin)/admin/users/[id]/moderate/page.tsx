import { ModerateUser } from "@/components/features/admin/users/ModerateUser";

export default async function ModerateUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ModerateUser id={id} />;
}
