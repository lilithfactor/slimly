'use client';

import React, { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';

const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;

const getMousePos = (e: MouseEvent | TouchEvent, container?: HTMLElement | null): { x: number; y: number } => {
  if (container) {
    const bounds = container.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
    return {
      x: clientX - bounds.left,
      y: clientY - bounds.top
    };
  }
  const clientX = 'clientX' in e ? e.clientX : (e as TouchEvent).touches[0].clientX;
  const clientY = 'clientY' in e ? e.clientY : (e as TouchEvent).touches[0].clientY;
  return { x: clientX, y: clientY };
};

interface CrosshairProps {
  color?: string;
  containerRef?: RefObject<HTMLElement | null>;
}

const Crosshair: React.FC<CrosshairProps> = ({ color = 'white', containerRef = null }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lineHorizontalRef = useRef<HTMLDivElement>(null);
  const lineVerticalRef = useRef<HTMLDivElement>(null);
  const filterXRef = useRef<SVGFETurbulenceElement>(null);
  const filterYRef = useRef<SVGFETurbulenceElement>(null);

  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent | TouchEvent) => {
      mouseRef.current = getMousePos(ev, containerRef?.current);
      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        const clientX = 'clientX' in ev ? ev.clientX : ev.touches[0].clientX;
        const clientY = 'clientY' in ev ? ev.clientY : ev.touches[0].clientY;

        if (
          clientX < bounds.left ||
          clientX > bounds.right ||
          clientY < bounds.top ||
          clientY > bounds.bottom
        ) {
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean), { opacity: 0 });
        } else {
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean), { opacity: 1 });
        }
      }
    };

    const target: HTMLElement | Window = containerRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove as any);
    target.addEventListener('touchmove', handleMouseMove as any);

    const renderedStyles: {
      [key: string]: { previous: number; current: number; amt: number };
    } = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 }
    };

    gsap.set([lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean), { opacity: 0 });

    const onInitialMove = (_ev: MouseEvent | TouchEvent) => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouseRef.current.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouseRef.current.y;

      gsap.to([lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean), {
        duration: 0.9,
        ease: 'Power3.easeOut',
        opacity: 1
      });

      requestAnimationFrame(render);

      target.removeEventListener('mousemove', onInitialMove as any);
      target.removeEventListener('touchmove', onInitialMove as any);
    };

    target.addEventListener('mousemove', onInitialMove as any);
    target.addEventListener('touchmove', onInitialMove as any);

    const primitiveValues = { turbulence: 0 };

    const tl = gsap
      .timeline({
        paused: true,
        onStart: () => {
          if (lineHorizontalRef.current) {
            lineHorizontalRef.current.style.filter = 'url(#filter-noise-x)';
          }
          if (lineVerticalRef.current) {
            lineVerticalRef.current.style.filter = 'url(#filter-noise-y)';
          }
        },
        onUpdate: () => {
          if (filterXRef.current && filterYRef.current) {
            filterXRef.current.setAttribute('baseFrequency', primitiveValues.turbulence.toString());
            filterYRef.current.setAttribute('baseFrequency', primitiveValues.turbulence.toString());
          }
        },
        onComplete: () => {
          if (lineHorizontalRef.current && lineVerticalRef.current) {
            lineHorizontalRef.current.style.filter = 'none';
            lineVerticalRef.current.style.filter = 'none';
          }
        }
      })
      .to(primitiveValues, {
        duration: 0.5,
        ease: 'power1.inOut',
        startAt: { turbulence: 1 },
        turbulence: 0
      });

    const enter = () => tl.restart();
    const leave = () => {
      tl.progress(1).kill();
    };

    let animationFrameId: number;

    const render = () => {
      renderedStyles.tx.current = mouseRef.current.x;
      renderedStyles.ty.current = mouseRef.current.y;

      for (const key in renderedStyles) {
        const style = renderedStyles[key];
        style.previous = lerp(style.previous, style.current, style.amt);
      }

      if (lineHorizontalRef.current && lineVerticalRef.current) {
        gsap.set(lineVerticalRef.current, { x: renderedStyles.tx.previous });
        gsap.set(lineHorizontalRef.current, { y: renderedStyles.ty.previous });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const isClickable = (el: HTMLElement | null): boolean => {
      if (!el || el === document.body || el === document.documentElement) return false;
      
      const style = window.getComputedStyle(el);
      const isInteractive = 
        style.cursor === 'pointer' || 
        ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) ||
        el.getAttribute('role') === 'button' ||
        el.hasAttribute('onclick') ||
        el.hasAttribute('data-fizzy');

      if (isInteractive) return true;
      return isClickable(el.parentElement);
    };

    let currentTarget: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isClickable(target)) {
        if (currentTarget !== target) {
          currentTarget = target;
          enter();
        }
      } else if (currentTarget) {
        currentTarget = null;
        leave();
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      target.removeEventListener('mousemove', handleMouseMove as any);
      target.removeEventListener('touchmove', handleMouseMove as any);
      target.removeEventListener('mousemove', onInitialMove as any);
      target.removeEventListener('touchmove', onInitialMove as any);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [containerRef]);

  return (
    <div
      ref={cursorRef}
      className="crosshair-cursor"
      style={{
        position: containerRef ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10000
      }}
    >
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterXRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterYRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>
      <div
        ref={lineHorizontalRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '1px',
          background: color,
          pointerEvents: 'none',
          top: 0,
          left: 0,
          opacity: 0
        }}
      />
      <div
        ref={lineVerticalRef}
        style={{
          position: 'absolute',
          height: '100%',
          width: '1px',
          background: color,
          pointerEvents: 'none',
          top: 0,
          left: 0,
          opacity: 0
        }}
      />
    </div>
  );
};

export default Crosshair;
