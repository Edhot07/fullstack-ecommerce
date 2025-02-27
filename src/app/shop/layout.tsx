import SearchFilterLayout from "./SearchFilterLayout";
import { getCollections } from "@/wix-api/collection";
import { getWixServerClient } from "@/lib/wix-client.server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await getCollections(getWixServerClient());
  return (
    <SearchFilterLayout collections={collections}>
      {children}
    </SearchFilterLayout>
  );
}
