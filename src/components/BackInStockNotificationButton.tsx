
import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { useCreateBackInStockNotificationRequest } from "@/hooks/back-in-stock";
import { z } from "zod";
import { requiredString } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./LoadingButton";
import { env } from "@/env";

const formSchema = z.object({
    email: requiredString.email(),
})

type formValues = z.infer<typeof formSchema>

interface BackInStockNotificationButtonProps extends ButtonProps{
    product: products.Product;
    selectedOptions: Record<string, string>; //Record is basically a map that contains a key and a value

}

export default function BackInStockNotificationButton({product, selectedOptions, ...props}: BackInStockNotificationButtonProps){
    const form = useForm<formValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    const mutation = useCreateBackInStockNotificationRequest();

    async function onSubmit({email}: formValues){
        mutation.mutate({
            email,
            itemUrl: env.NEXT_PUBLIC_BASE_URL + "/products/" + product.slug,
            product,
            selectedOptions,
        })
    }

    return <Dialog>
        <DialogTrigger asChild>
            <Button {...props}>Notify when available</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Notify when available again
                </DialogTitle>
                <DialogDescription>
                    Enter your email to be notified when this product becomes available again.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <LoadingButton type="submit" loading = {mutation.isPending}>
                        Notify me
                    </LoadingButton>
                </form>
            </Form>
            {mutation.isSuccess && (
                <div className="py-2.5 text-green-500">
                    Thank you! We will notify you as soon as the product in stock!
                </div>
            )}
            {/* {mutation.isError && (
                
                <div className="py-2.5 text-red-500">
                    An error occurred while sending the notification. Please try again later.
                </div>
            )} */}
        </DialogContent>
    </Dialog>
}