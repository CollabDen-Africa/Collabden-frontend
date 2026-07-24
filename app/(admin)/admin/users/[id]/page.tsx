import { UserDetails } from "@/components/features/admin/users/UserDetails";

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserDetails id={id} />;
}
