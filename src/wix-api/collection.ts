import { getWixClient, WixClient,  } from "@/lib/wix-client.base";

export  async function getCollectionBySlug(wixClient: WixClient, slug:string){
    // const wixClient = getWixClient();
    const { collection } = await wixClient.collections.getCollectionBySlug(slug);

    return collection || null;
}