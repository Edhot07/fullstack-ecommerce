import { WIX_STORES_APP_ID } from "@/lib/constants";
import { findVariant } from "@/lib/utils";
import { getWixClient, WixClient,   } from "@/lib/wix-client.base";
// import { WixClient } from "@wix/sdk";
import { products } from "@wix/stores";

export async function getCart(wixclient: WixClient,) {
  // const wixClient = await getWixClient();
  try {
    const a = await wixclient.currentCart.getCurrentCart();
    return await wixclient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      (error as any).details.applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      console.log(error, "This is an error")
      return null;
    } else {
      throw error;
    }
  }
}

export interface AddToCartValues {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}
export async function addToCart(
  wixClient: WixClient,
  {
  product,
  selectedOptions,
  quantity,
}: AddToCartValues) {
  // const wixClient = getWixClient();

  const selectedVariant = findVariant(product, selectedOptions);

  

  return wixClient.currentCart.addToCurrentCart({
    lineItems: [
      {
        catalogReference: {
          appId: WIX_STORES_APP_ID,
          catalogItemId: product._id,
          options: selectedVariant
            ? {
                variantId: selectedVariant._id,
              }
            : { options: selectedOptions },
        },
        quantity,
      },
    ],
  });
}



export interface UpdateCartItemQuantityValues {
  productId: string;
  newQuantity: number;

}
export async function updateCartItemQuantity(
  wixClient:WixClient,
  {productId, newQuantity}: UpdateCartItemQuantityValues
){
  return wixClient.currentCart.updateCurrentCartLineItemQuantity([
    {
      _id: productId,
      quantity: newQuantity,
    }
  ])
}

export async function removeCartItem(wixclient: WixClient, productId: string){
  return wixclient.currentCart.removeLineItemsFromCurrentCart([productId])

}

export async function clearCart(wixClient: WixClient){
  try {
    return await wixClient.currentCart.deleteCurrentCart();
  } catch (error) {
    if (
      (error as any).details.applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      return;
    } else {
      throw error;
    }
  }
}