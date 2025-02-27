import { getWixServerClient } from "@/lib/wix-client.server";
import { getProductById } from "@/wix-api/products";
import { notFound, redirect } from "next/navigation";

interface PageProps{
    params: {id: string};
    searchParams: any;
}
export default async function page({params, searchParams}: PageProps) {
  if(params.id === "someId"){
    redirect(`/products/i-m-a-product-3?${new URLSearchParams(searchParams)}`)
  }

  const product = await getProductById(getWixServerClient(), params.id)

  if(!product) notFound();

  redirect(`/products/${product.slug}?${new URLSearchParams(searchParams)}`)
}
