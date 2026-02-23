import { redirect } from "next/navigation";

export default async function LegacyPickPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  redirect(`/library/${categoryId}`);
}
