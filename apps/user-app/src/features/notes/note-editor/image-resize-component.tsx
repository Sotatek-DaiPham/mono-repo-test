'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';

interface ImageResizeProps {
  node: {
    attrs: {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    };
  };
  updateAttributes: (attrs: { width?: number; height?: number }) => void;
}

export function ImageResizeComponent({ node, updateAttributes }: ImageResizeProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: node.attrs.width || null,
    height: node.attrs.height || null,
  });

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    if (!dimensions.width && !dimensions.height && naturalWidth && naturalHeight) {
      // Set initial dimensions based on natural size
      const maxWidth = 600;
      if (naturalWidth > maxWidth) {
        const ratio = maxWidth / naturalWidth;
        setDimensions({
          width: maxWidth,
          height: Math.round(naturalHeight * ratio),
        });
      } else {
        setDimensions({
          width: naturalWidth,
          height: naturalHeight,
        });
      }
    }
  }, [dimensions.width, dimensions.height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imgRef.current) return;

    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = imgRef.current.offsetWidth || 0;
    const startHeight = imgRef.current.offsetHeight || 0;
    const aspectRatio = startWidth / startHeight;

    let currentWidth = startWidth;
    let currentHeight = startHeight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imgRef.current) return;

      const deltaX = e.clientX - startX;
      const newWidth = Math.max(50, Math.min(startWidth + deltaX, 1200));
      const newHeight = newWidth / aspectRatio;

      currentWidth = newWidth;
      currentHeight = newHeight;

      setDimensions({
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });

      imgRef.current.style.width = `${newWidth}px`;
      imgRef.current.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      updateAttributes({
        width: Math.round(currentWidth),
        height: Math.round(currentHeight),
      });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <NodeViewWrapper as="div" className="image-wrapper" ref={wrapperRef}>
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        style={{
          width: dimensions.width ? `${dimensions.width}px` : 'auto',
          height: dimensions.height ? `${dimensions.height}px` : 'auto',
          maxWidth: '100%',
          display: 'block',
          borderRadius: '0.5rem',
          margin: '1rem 0',
        }}
        onLoad={() => {
          if (!imgRef.current) return;
          const img = imgRef.current;
          if (!dimensions.width && !dimensions.height) {
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            if (naturalWidth && naturalHeight) {
              const maxWidth = 600;
              if (naturalWidth > maxWidth) {
                const ratio = maxWidth / naturalWidth;
                const newWidth = maxWidth;
                const newHeight = Math.round(naturalHeight * ratio);
                setDimensions({ width: newWidth, height: newHeight });
                img.style.width = `${newWidth}px`;
                img.style.height = `${newHeight}px`;
              } else {
                setDimensions({ width: naturalWidth, height: naturalHeight });
              }
            }
          }
        }}
      />
      <div
        className="image-resize-handle"
        onMouseDown={handleMouseDown}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 11L1 1M11 1V11H1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </NodeViewWrapper>
  );
}

