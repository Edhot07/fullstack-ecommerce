import { getWixClient, WixClient } from "@/lib/wix-client.base";
import { cache } from "react";

type ProductsSort = "last_updated" | "price_asc" | "price_desc";

interface QueryProductsFilter {
  collectionIds?: string[] | string;
  sort?: ProductsSort;
}

export async function queryProducts(
  wixclient: WixClient,
  { collectionIds, sort = "last_updated" }: QueryProductsFilter,
) {
  // const wixClient = getWixClient();
  // console.log("This is the wixclient",wixClient.products.queryProducts())
  // let query = wixClient.products.queryProducts();
  let query = wixclient.products.queryProducts();

  const collectionIdsArray = collectionIds
    ? Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds]
    : [];

  if (collectionIdsArray.length > 0) {
    query = query.hasSome("collectionIds", collectionIdsArray);
    // console.log(collectionIdsArray)
  }

  switch (sort) {
    case "price_asc":
      query = query.ascending("price");
      break;
    case "price_desc":
      query = query.descending("price");
      break;
    case "last_updated":
      query = query.descending("lastUpdated");
      break;
  }
  return query.find();
}

export const getProductBySlug = cache(
  async (wixclient: WixClient, slug: string) => {
    //This function is wrapped into react cache function
    //In React, you can use the cache function from react to memoize or "cache" the result of expensive functions, which can help optimize performance, especially in server components.
    // const wixClient = getWixClient();

    const { items } = await wixclient.products
      .queryProducts()
      .eq("slug", slug)
      .limit(1)
      .find();

    const product = items[0];

    if (!product || !product.visible) {
      return null;
    }
    return product;
  },
);
