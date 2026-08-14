"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

type MediaRailProps = {
  children: ReactNode;
  label: string;
};

export default function MediaRail({ children, label }: MediaRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false });
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
      startX: event.clientX,
      startScrollLeft: rail.scrollLeft,
      moved: false,
    };
    setDragging(true);
    rail.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active) return;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 5) drag.moved = true;
    rail.scrollLeft = drag.startScrollLeft - delta;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragRef.current.active) return;
    dragRef.current.active = false;
    setDragging(false);
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
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
          if (!dragRef.current.moved) return;
          event.preventDefault();
          event.stopPropagation();
          dragRef.current.moved = false;
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
