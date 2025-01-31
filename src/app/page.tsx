import Image from "next/image";
import banner from "../assets/bannertwo.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { delay } from "@/lib/utils";
import { Suspense } from "react";
import { getWixClient } from "@/lib/wix-client.base";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import {getCollectionBySlug} from "@/wix-api/collection";
import { queryProducts } from "@/wix-api/products";
import { getWixServerClient } from "@/lib/wix-client.server";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl space-y-10  px-5 py-10">
      <div className="flex items-center bg-secondary md:h-96">
        <div className="space-y-7 p-10 text-center md:w-1/2">
          <h1 className="text-3xl font-bold md:text-4xl">
            Fill the void in your heart
          </h1>
          <p>
            Tough day? Credit card maxed out? Buy some expensive stuff and
            become happy again!
          </p>
          <Button asChild>
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
        <div className="relative hidden h-full w-1/2 bg-fuchsia-700 md:block">
          <Image
            className="h-full object-cover"
            src={banner}
            alt="A placeholder image"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent" />
        </div>
      </div>
      <Suspense fallback={<LoadingSckeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}

async function FeaturedProducts() {
  await delay(1000);

  const wixClient = getWixServerClient();

  const collection = await getCollectionBySlug(wixClient,"feature-products")

  if (!collection?._id) {
    return null;
  }

  // const featuredProducts = await wixClient.products
  //   .queryProducts()
  //   .hasSome("collectionIds", [collection._id])
  //   .descending("lastUpdated")
  //   .find();
  const featuredProducts = await queryProducts(wixClient,{
    collectionIds: collection._id,
    sort: "last_updated"
  });

  if (!featuredProducts.items.length) {
    return null;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <div className="grid-col-2 flex flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {featuredProducts.items.map((product) => (
          <Product product={product} key={product._id} />
        ))}
      </div>
      {/* <pre>
        {JSON.stringify(featuredProducts, null, 2)}
      </pre> */}
    </div>
  );
}

function LoadingSckeleton() {
  return (
    <div className="grid-col-2 flex flex-col gap-5 p-10 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[26rem] w-full" />
      ))}
    </div>
  );
}
