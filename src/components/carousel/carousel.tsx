"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface CarouselProps {
  assets: string[];
  delay?: number;
}

const Carousel: React.FC<CarouselProps> = ({ assets, delay }) => {
  delay = delay || 3000
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // eslint-disable-next-line no-undef
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % assets.length);
    }, delay);
    setIntervalId(id);

    return () => clearInterval(id);
  }, [assets.length, delay]);

  const resetInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      const id = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % assets.length);
      }, delay);
      setIntervalId(id);
    }
  };

  const nextImage = () => {
    resetInterval();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % assets.length);
  };

  const prevImage = () => {
    resetInterval();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? assets.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full max-w-[400px] mx-auto">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center absolute top-[50%] left-0 w-full z-10 px-2">
        <button
          onClick={prevImage}
          className="text-gray-600 bg-white/80 hover:bg-gray-700 hover:text-white backdrop-blur-sm transition-all duration-200 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
          aria-label="Previous image"
        >
          <FaArrowLeft className="w-4 h-4"/>
        </button>
        <button
          onClick={nextImage}
          className="text-gray-600 bg-white/80 hover:bg-gray-700 hover:text-white backdrop-blur-sm transition-all duration-200 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
          aria-label="Next image"
        >
          <FaArrowRight className="w-4 h-4"/>
        </button>
      </div>

      {/* Fixed Height Image Container */}
      <div className='flex justify-center items-center relative h-[400px]'>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full flex justify-center items-center absolute inset-0"
          >
            <Image
              src={assets[currentImageIndex]}
              alt={`Project image ${currentImageIndex + 1}`}
              width={400}
              height={400}
              className='max-w-full max-h-full object-contain rounded-lg shadow-xl'
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              quality={90}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Image Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {assets.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentImageIndex(index);
              resetInterval();
            }}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentImageIndex
                ? 'bg-blue-500 scale-110'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
