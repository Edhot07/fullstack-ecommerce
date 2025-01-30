import { wixBroserClient } from "@/lib/wix-client.browser";
import {
  addToCart,
  AddToCartValues,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  UpdateCartItemQuantityValues,
} from "@/wix-api/cart";
import {
    MutationKey,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { cart, currentCart } from "@wix/ecom";
import { useToast } from "./use-toast";

const queryKey: QueryKey = ["cart"];

export function useCart(initialData: currentCart.Cart | null) {
  return useQuery({
    queryKey,
    queryFn: () => getCart(wixBroserClient),
    initialData,
  });
}

export function useAddItemToCart() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: AddToCartValues) => addToCart(wixBroserClient, values),
    onSuccess(data) {
      toast({ description: "Item added to cart" });
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, data.cart);
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to add item to cart",
      });
    },
  });
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutationKey: MutationKey= ["useUpdateCartItemQuantity"]

  return useMutation({
    mutationKey,
    mutationFn: (values: UpdateCartItemQuantityValues) =>
      updateCartItemQuantity(wixBroserClient, values),
    onMutate: async ({ productId, newQuantity }) => {
      await queryClient.cancelQueries({ queryKey });
      
      const previousState =
        queryClient.getQueryData<currentCart.Cart>(queryKey);

      queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.map((lineItem) =>
          lineItem._id === productId
            ? { ...lineItem, quantity: newQuantity }
            : lineItem,
        ),
      }));

      return {previousState};

    },

    onError(error, variables, context) {
        queryClient.setQueryData(queryKey, context?.previousState)
        console.error(error);
        toast({
            variant: "destructive",
            description: "Failed to update cart item quantity",
        })
    },

    onSettled(){
        if(queryClient.isMutating({mutationKey})===1){
          queryClient.invalidateQueries({queryKey});
        }
    }

  });
}


export function useRemoveCartItem(){
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productId: string)=> removeCartItem(wixBroserClient, productId),
    onMutate: async (productId)=>{
      await queryClient.cancelQueries({ queryKey });
      
      const previousState =
        queryClient.getQueryData<currentCart.Cart>(queryKey);
        queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData)=>({
          ...oldData,
          lineItems: oldData?.lineItems?.filter(
            lineItem =>lineItem._id!==productId
          )
          
        }))

        return {previousState}
    },
    
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState)
        console.error(error);
        toast({
            variant: "destructive",
            description: "Failed to update cart item quantity",
        })
    },
    onSettled(){
      queryClient.invalidateQueries({queryKey})
      
    }
  })
}
