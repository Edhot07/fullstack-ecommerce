import { getWixClient, WixClient } from "@/lib/wix-client.base";
import { collections } from "@wix/stores";
import { cache } from "react";

export const getCollectionBySlug = cache (async(wixClient: WixClient, slug: string) =>{
  // const wixClient = getWixClient();
  const { collection } = await wixClient.collections.getCollectionBySlug(slug);

  return collection || null;
})

export const getCollections = cache(
  async (wixClient: WixClient): Promise<collections.Collection[]> => {
    const collections = await wixClient.collections
    .queryCollections()
    .ne("_id", "00000000-000000-000000-000000000001") // exclude all products
    .ne("_id", "b2a03c36-97bb-d9f5-4322-85fc3852ffac") //exlude featured products
    .find();

    return collections.items;
  },
);
