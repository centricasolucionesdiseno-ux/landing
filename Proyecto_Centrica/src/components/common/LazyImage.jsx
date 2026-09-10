import { useState, useEffect, useRef } from 'react';

const LazyImage = ({
  src,
  alt,
  className = '',
  style = {},
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3C/svg%3E'
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const imgElement = imgRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const actualSrc = img.getAttribute('data-src');

            if (actualSrc && actualSrc !== imageSrc) {
              const loadImage = new Image();
              loadImage.src = actualSrc;
              loadImage.onload = () => {
                setImageSrc(actualSrc);
                setIsLoaded(true);
              };
            }

            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [src, imageSrc]);

  return (
    <img
      ref={imgRef}
      data-src={src}
      src={imageSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.6
      }}
      loading="lazy"
    />
  );
};

export default LazyImage;
