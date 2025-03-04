"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { banners } from "@/assets/banners";
import Image from "next/image";

export function CarouselBanner() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[Autoplay({ delay: 5000 })]}
      className="h-full overflow-hidden"
    >
      <CarouselContent>
        {banners.map((banner, index) => (
          <CarouselItem className="" key={index}>
            <Card>
                <Image
                  key={index}
                  className="h-96 object-cover"
                  src={banner}
                  alt="A placeholder image"
                />
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

