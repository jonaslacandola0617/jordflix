"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

type MediaRailProps = {
  children: ReactNode;
  label: string;
};

export default function MediaRail({ children, label }: MediaRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    captured: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [dragging, setDragging] = useState(false);

  const syncControls = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
    setCanScrollLeft(rail.scrollLeft > 4);
    setCanScrollRight(rail.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    syncControls();
    const resizeObserver = new ResizeObserver(syncControls);
    resizeObserver.observe(rail);
    Array.from(rail.children).forEach(child => resizeObserver.observe(child));

    return () => resizeObserver.disconnect();
  }, [children, syncControls]);

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const distance = Math.max(280, rail.clientWidth * 0.82);
    rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;

    dragRef.current = {
      active: true,
      captured: false,
      startX: event.clientX,
      startScrollLeft: rail.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active) return;

    const delta = event.clientX - drag.startX;

    if (!drag.moved && Math.abs(delta) <= 6) return;

    if (!drag.moved) {
      drag.moved = true;
      setDragging(true);
      rail.setPointerCapture(event.pointerId);
      drag.captured = true;
    }

    event.preventDefault();
    rail.scrollLeft = drag.startScrollLeft - delta;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active) return;

    const moved = drag.moved;
    drag.active = false;
    drag.moved = false;
    setDragging(false);

    if (drag.captured && rail.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
    drag.captured = false;

    if (moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  return (
    <div className="media-rail-shell">
      <button
        className="media-rail-nav media-rail-prev"
        type="button"
        aria-label={`Scroll ${label} left`}
        onClick={() => scrollRail(-1)}
        disabled={!canScrollLeft}
      >
        <span aria-hidden="true">←</span>
      </button>

      <div
        ref={railRef}
        className={`media-rail ${dragging ? "is-dragging" : ""}`}
        onScroll={syncControls}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={event => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClickRef.current = false;
        }}
      >
        {children}
      </div>

      <button
        className="media-rail-nav media-rail-next"
        type="button"
        aria-label={`Scroll ${label} right`}
        onClick={() => scrollRail(1)}
        disabled={!canScrollRight}
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
