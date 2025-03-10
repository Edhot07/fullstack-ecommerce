import { WIX_STORES_APP_ID } from "@/lib/constants";
import { WixClient } from "@/lib/wix-client.base";
import { cache } from "react";

export type ProductsSort = "last_updated" | "price_asc" | "price_desc";

interface QueryProductsFilter {
  q?: string;
  collectionIds?: string[] | string;
  sort?: ProductsSort;
  priceMin?: number;
  priceMax?: number;
  limit?: number;
  skip?: number;
}

export async function queryProducts(
  wixclient: WixClient,
  {
    q,    
    collectionIds,
    sort = "last_updated",
    skip,
    limit,
    priceMin,
    priceMax,
  }: QueryProductsFilter,
) {
  // const wixClient = getWixClient();
  // console.log("This is the wixclient",wixClient.products.queryProducts())
  // let query = wixClient.products.queryProducts();
  let query = wixclient.products.queryProducts();

  if (q) {
    // query = query.startsWith("name", q);
    {/* @ts-expect-error */}
    query = query.contains("name", q);
  }

  const collectionIdsArray = collectionIds
    ? Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds]
    : [];

  if (collectionIdsArray.length > 0) {
    query = query.hasSome("collectionIds", collectionIdsArray);
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
  if (priceMin) {
    query = query.ge("priceData.price", priceMin);
  }
  if (priceMax) {
    query = query.le("priceData.price", priceMax);
  }
  if (limit) query = query.limit(limit);
  if (skip) query = query.skip(skip);
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

export async function getProductById(wixClient: WixClient,
  productId: string
){
  const result = await wixClient.products.getProduct(productId)
  return result.product;
}

export async function getRelatedProducts(
  wixClient: WixClient,
  productId: string,
) {
  const result = await wixClient.recommendations.getRecommendation(
    [
      {
        _id: "68ebce04-b96a-4c52-9329-08fc9d8c1253", //From the same categories
        appId: WIX_STORES_APP_ID,
      },
      {
        _id: "d5aac1e1-2e53-4d11-85f7-7172710b4783", //Frequently bought together
        appId: WIX_STORES_APP_ID,
      },
    ],
    {
      items: [
        {
          appId: WIX_STORES_APP_ID,
          catalogItemId: productId,
        },
      ],
      minimumRecommendedItems: 3,
    },
  );

  const productIds = result.recommendation?.items
    .map((item) => item.catalogItemId)
    .filter((id) => id !== undefined);

  if (!productIds || !productIds.length) return [];

  const productsResult = await wixClient.products
    .queryProducts()
    .in("_id", productIds)
    .limit(4)
    .find();

  return productsResult.items;
}
