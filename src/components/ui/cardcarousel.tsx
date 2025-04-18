import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React from "react";

interface ICardCarouselProps {
  title: string;
  render: React.ReactNode;
}

function CardCarousel({ title, render }: ICardCarouselProps) {
  return (
    <>
      <h1 className="text-xl p-4">{title}</h1>
      <Carousel
        autoplay
        autoplayInterval={8000}
        opts={{ loop: true, slidesToScroll: 2 }}
        className="mb-4"
      >
        <CarouselContent>{render}</CarouselContent>
        <CarouselPrevious size="lg" variant="default" />
        <CarouselNext size="lg" variant="default" />
      </Carousel>
    </>
  );
}

export default CardCarousel;
