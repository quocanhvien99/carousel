import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import styles from "./styles/carousel.module.css";

interface Slide {
  id: number;
  title: string;
  image: string;
  landing_page: string;
}

interface CarouselProps {
  slides: Slide[];
  autoplay?: boolean;
  autoplaySpeed?: number;
}

const DRAG_THRESHOLD = 40; // Minimum drag distance to trigger slide change
const SLIDE_WIDTH = 300; // Width of each slide

export default function Carousel({
  slides,
  autoplay = false,
  autoplaySpeed = 3000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);

  const hasDragged = useRef(false);
  const startX = useRef(0);
  const isTransitionStart = useRef(false);
  const isHovering = useRef(false);

  const internalSlides = useMemo(() => {
    if (slides.length === 1) {
      return [...slides, ...slides, ...slides];
    }
    return slides;
  }, [slides]);

  const nextSlide = () => {
    let slideOffset = Math.floor(-offset / SLIDE_WIDTH);
    if (offset % SLIDE_WIDTH < -DRAG_THRESHOLD) {
      slideOffset += 1;
    }

    setCurrentIndex((prevIndex) => {
      return prevIndex + slideOffset;
    });
  };

  const prevSlide = () => {
    let slideOffset = Math.floor(offset / SLIDE_WIDTH);
    if (offset % SLIDE_WIDTH > DRAG_THRESHOLD) {
      slideOffset += 1;
    }

    setCurrentIndex((prevIndex) => {
      return prevIndex - slideOffset;
    });
  };

  const handleClickSlide = (url: string) => {
    if (!hasDragged.current) {
      window.open(url, "_blank");
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isTransitionStart.current) return;

    startX.current = e.clientX;
    setIsDragging(true);
    hasDragged.current = false;
  };

  const handlePointerMove = useEffectEvent(function (ev: PointerEvent) {
    if (!isDragging) return;
    let offset = ev.clientX - startX.current;

    const isForwardDrag = offset < 0;

    if (isForwardDrag) {
      if (-offset / SLIDE_WIDTH + currentIndex > internalSlides.length) {
        setCurrentIndex(0);
        offset = offset % SLIDE_WIDTH;
        startX.current = ev.clientX - offset;
      }
    } else if (currentIndex - offset / SLIDE_WIDTH <= -1) {
      setCurrentIndex(internalSlides.length - 1);
      offset = offset % SLIDE_WIDTH;
      startX.current = ev.clientX - offset;
    }

    setOffset(offset);

    // If the user has dragged more than 5 pixels, consider it a drag and not a click
    if (Math.abs(ev.clientX - startX.current) > 5) {
      hasDragged.current = true;
    }
  });

  const handlePointerUp = useEffectEvent(() => {
    console.log("offset");
    if (!isDragging) return;
    if (offset < 0) nextSlide();
    else prevSlide();
    setIsDragging(false);
    setOffset(0);
  });

  const handleTransitionEnd = () => {
    isTransitionStart.current = false;

    if (currentIndex === -1 || currentIndex === internalSlides.length) {
      const newIndex = currentIndex === -1 ? internalSlides.length - 1 : 0;
      setDisableTransition(true);
      setCurrentIndex(newIndex);
      setTimeout(() => setDisableTransition(false), 200);
    }
  };

  const handleAutoPlay = useEffectEvent(() => {
    if (
      isHovering.current ||
      isDragging ||
      document.visibilityState === "hidden"
    )
      return;

    setCurrentIndex((prevIndex) => {
      return prevIndex + 1;
    });
  });

  // Handle drag outside the container
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [isDragging]);

  // Handle autoplay
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleAutoPlay, autoplaySpeed);

    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed]);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => {
        isHovering.current = true;
      }}
      onMouseLeave={() => {
        isHovering.current = false;
      }}
    >
      <div
        className={styles.track}
        style={{
          transform: `translateX(${-currentIndex * SLIDE_WIDTH + offset - SLIDE_WIDTH}px)`,
          transition:
            isDragging || disableTransition
              ? "none"
              : "transform 0.2s ease-in-out",
          cursor: isDragging ? "grabbing" : "pointer",
        }}
        onPointerDown={handlePointerDown}
        onTransitionStart={() => {
          isTransitionStart.current = true;
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div
          key={"infinite-start-" + internalSlides.at(-1)?.id}
          className={styles.slide}
        >
          <img
            src={internalSlides.at(-1)?.image}
            alt={internalSlides.at(-1)?.title}
            draggable={false}
          />
          <div className={styles.index}>start {internalSlides.at(-1)?.id}</div>
        </div>

        {internalSlides.map((slide) => (
          <div
            key={slide.id}
            className={styles.slide}
            draggable={false}
            onClick={() => handleClickSlide(slide.landing_page)}
          >
            <img src={slide.image} alt={slide.title} draggable={false} />
            <div className={styles.index}>{slide.id}</div>
          </div>
        ))}

        {internalSlides.slice(0, 3).map((slide) => (
          <div
            key={"infinite-end-" + slide.id}
            className={styles.slide}
            draggable={false}
          >
            <img src={slide.image} alt={slide.title} draggable={false} />
            <div className={styles.index}>end {slide.id}</div>
          </div>
        ))}
      </div>
      <ul className={styles.navigation}>
        {internalSlides.map((slide, index) => (
          <li
            className={index === currentIndex ? styles.active : ""}
            key={slide.id}
            onClick={() => {
              setCurrentIndex(index);
            }}
          />
        ))}
      </ul>
    </div>
  );
}
