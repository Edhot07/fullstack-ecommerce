import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";
import { PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom"; //in order to this work add @import "~react-medium-image-zoom/dist/styles.css"; in global css

interface ProductMediaProps {
  media: products.MediaItem[] | undefined;
}

export default function ProductMedia({ media }: ProductMediaProps) {
  const [selectedMedia, setselectedMedia] = useState(media?.[0]);

  useEffect(()=>(
    setselectedMedia(media?.[0])
  ), [media])
  
  if (!media?.length) return null;

  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];

  return (
    <div className="h-fit basis-2/5 space-y-5 md:sticky md:top-10">
      <div className="s aspect-square bg-secondary">
        {selectedImage ? (
            // The key={selectedImage.url}:This tells react that whenever the imageUrl changes it has to throw away the old zoom component and rerender it from scratch. In other words, on mouseEnter if we are seleting another image it shows the previous image until the new image is loaded so to avoid that we use this one. this will show the background color if the image has not been loaded
          <Zoom key={selectedImage.url}>
            <WixImage
              mediaIdentifier={selectedImage.url}
              alt={selectedImage.altText || "placeholder"}
              width={1000}
              height={1000}
            />
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className="flex size-full items-center bg-black">
            <video controls loop className="size-full">
              <source
                src={selectedVideo.url}
                type={`video/${selectedVideo.format}`}
              />
            </video>
          </div>
        ) : null}
      </div>
      {media.length > 1 && (
        <div className="flex flex-wrap items-center gap-5">
          {media.map((mediaItem) => (
            <MediaPreview
              key={mediaItem._id}
              mediaItem={mediaItem}
              isSelected={selectedMedia?._id === mediaItem._id}
              onSelect={() => setselectedMedia(mediaItem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MediaPreviewProps {
  mediaItem: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

function MediaPreview({ mediaItem, isSelected, onSelect }: MediaPreviewProps) {
  const imageUrl = mediaItem.image?.url;
  const stillFrameMediaId = mediaItem.video?.stillFrameMediaId;
  const thumbnailUrl = mediaItem.thumbnail?.url;
  const resolvedThumbnailUrl =
    stillFrameMediaId && thumbnailUrl
      ? thumbnailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId
      : undefined;

  if (!imageUrl && !resolvedThumbnailUrl) return null;

  return (
    <div
      className={cn(
        "relative cursor-pointer bg-secondary",
        isSelected && "outline outline-1 outline-primary",
      )}
    >
      <WixImage
        mediaIdentifier={imageUrl || resolvedThumbnailUrl}
        alt={mediaItem.image?.altText || mediaItem.video?.files?.[0].altText}
        width={100}
        height={100}
        onMouseEnter={onSelect}
      />
      {resolvedThumbnailUrl && (
        <span className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40">
          <PlayIcon className="size-5 text-white/60" />
        </span>
      )}
    </div>
  );
}
