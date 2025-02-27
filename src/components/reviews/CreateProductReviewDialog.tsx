import { products } from "@wix/stores";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductReview } from "@/hooks/reviews";
import { Label } from "../ui/label";
import WixImage from "../WixImage";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../LoadingButton";
import StarRatingInput from "./StarRatingInput";
import { useRef } from "react";
import { Button } from "../ui/button";
import { CircleAlert, Loader2, Upload, X } from "lucide-react";
import useMediaUpload, { MediaAttachment } from "./useMediaUpload";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Must be at least 5 characters")
    .max(100, "Can't be longe the 100 characters")
    .or(z.literal("")), //using literal we can pass empty string
  body: z
    .string()
    .trim()
    .min(15, "Must be at least 15 characters")
    .max(2000, "Must be at least 3000 characters")
    .or(z.literal("")),
  rating: z.number().int().min(1, "Please rate this product"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProductReviewDialogProps {
  product: products.Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

export default function CreateProductReviewDialog({
  product,
  open,
  onOpenChange,
  onSubmitted,
}: CreateProductReviewDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      rating: 0,
    },
  });
  const mutation = useCreateProductReview();

  const { attachments, startUpload, removeAttachment, clearAttachments } =
    useMediaUpload();

  const router = useRouter();

  async function onSubmit({ title, body, rating }: FormValues) {
    if (!product._id) {
      throw Error("Product ID is missing");
    }
    mutation.mutate(
      {
        productId: product._id,
        title,
        body,
        rating,
        media: attachments
          .filter((m) => m.url)
          .map((m) => ({
            url: m.url!,
            type: m.file.type.startsWith("image") ? "image" : "video",
          })),
      },
      {
        onSuccess: () => {
          form.reset();
          clearAttachments();
          onSubmitted();
          setTimeout(() => {
            router.refresh();
          }, 2000);
        },
      },
    );
  }

  const uploadInProgress = attachments.some((m) => m.state === "uploading");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Share your thought about this product
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Product</Label>
            <div className="flex items-center gap-3">
              <WixImage
                mediaIdentifier={product.media?.mainMedia?.image?.url}
                width={50}
                height={50}
              />
              <span>{product.name}</span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (Required)</FormLabel>
                    <FormControl>
                      <StarRatingInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripe your experience about this product"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Write your honest review of this product to help other
                      customers
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-5">
                {attachments.map((attachment) => (
                  <AttachmentPreview
                    key={attachment.id}
                    attachment={attachment}
                    onRemoveClick={removeAttachment}
                  />
                ))}

                <AddMediaButton
                  onFileSelected={startUpload}
                  disabled={
                    attachments.filter((a) => a.state !== "failed").length >= 5
                  }
                />
              </div>
              <LoadingButton
                type="submit"
                loading={mutation.isPending}
                disabled={uploadInProgress}
              >
                Submit
              </LoadingButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AddMediaButtonProps {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}
function AddMediaButton({ onFileSelected, disabled }: AddMediaButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        title="Add media"
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFileSelected(files[0]);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: MediaAttachment;
  onRemoveClick: (id: string) => void;
}
function AttachmentPreview({
  attachment: { id, file, state, url },
  onRemoveClick,
}: AttachmentPreviewProps) {
  return (
    <div
      className={cn(
        "relative size-fit",
        state === "failed" && "outline outline-1 outline-destructive",
      )}
    >
      {file.type.startsWith("image") ? (
        <WixImage
          mediaIdentifier={url}
          scaleToFill={false}
          placeholder={URL.createObjectURL(file)}
          alt="Attachment preview"
          className={cn(
            "max-h-24 max-w-24 object-contain",
            !url && "opacity-50",
          )}
        />
      ) : (
        <video
          controls
          className={cn("max-h-24 max-w-24", !url && "opacity-50")}
        >
          <source src={url || URL.createObjectURL(file)} type={file.type} />
        </video>
      )}
      {state === "uploading" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {state === "failed" && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          title="Failed to upload media"
        >
          <CircleAlert className="text-destructive" />
        </div>
      )}
      <button
        title="Remove media"
        type="button"
        onClick={() => onRemoveClick(id)}
        className="absolute -right-1.5 -top-1.5 border bg-background"
      >
        <X size={20} />
      </button>
    </div>
  );
}
