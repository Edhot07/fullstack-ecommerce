import { WIX_STORES_APP_ID } from "@/lib/constants";
import { findVariant } from "@/lib/utils";
import { WixClient } from "@/lib/wix-client.base";
import { checkout } from "@wix/ecom";
import { products } from "@wix/stores";
import { env } from "process";

export async function getCheckoutUrlForCurrentCart(wixclient: WixClient) {
  const { checkoutId } =
    await wixclient.currentCart.createCheckoutFromCurrentCart({
      channelType: checkout.ChannelType.WEB,
    });

  const { redirectSession } = await wixclient.redirects.createRedirectSession({
    ecomCheckout: { checkoutId },
    callbacks: {
      postFlowUrl: window.location.href,
      thankYouPageUrl: env.NEXT_PUBLIC_BASE_URL + "/checkout-success",
    },
  });
  if (!redirectSession) {
    throw Error("Failed to create redirect session");
  }

  return redirectSession.fullUrl;
}

export interface GetChechoutUrlForProductValues{
    product: products.Product;
    quantity: number;
    selectedOptions: Record<string, string>;
}
export async function getCheckoutUrlForProduct(
    wixClient: WixClient,
    {product, quantity, selectedOptions}: GetChechoutUrlForProductValues
) {
    const selectedVariant = findVariant(product, selectedOptions);

    const {_id} = await wixClient.checkout.createCheckout({
        channelType: checkout.ChannelType.WEB,
        lineItems: [
            {
                catalogReference: {
                    appId: WIX_STORES_APP_ID,
                    catalogItemId: product._id,
                    options: selectedVariant
                    ? {
                        variantId: selectedVariant._id
                    }
                    : {options: selectedOptions}
                },
                quantity,
            }
        ]
    });
    
    if(!_id){
        throw new Error("Failed to create checkout")
    }

    const {redirectSession} = await wixClient.redirects.createRedirectSession({
        ecomCheckout: {checkoutId: _id},
        callbacks: {
            postFlowUrl: window.location.href,
            thankYouPageUrl: env.NEXT_PUBLIC_BASE_URL + "/checkout-success"
        }
    })

    if(!redirectSession){
        throw Error("Failed to create redirect session")
    }

    return redirectSession.fullUrl;
}
