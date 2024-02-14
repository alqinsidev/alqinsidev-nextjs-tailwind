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
    }, delay); // Change image every 3 seconds
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
    <div className="relative">
      <div className="flex justify-between items-center absolute top-[50%] left-0 w-full z-10">
        <button
          onClick={prevImage}
          className="text-gray-400 bg-gray-50 hover:bg-gray-700 hover:text-white  transition ease-linear duration-100 active:bg-gray-70 p-2 rounded-full"
        >
          <FaArrowLeft/>
        </button>
        <button
          onClick={nextImage}
          className="text-gray-400 bg-gray-50 hover:bg-gray-700 hover:text-white  transition ease-linear duration-100 active:bg-gray-70 p-2 rounded-full"
        >
          <FaArrowRight/>
        </button>
      </div>
      <div className='flex justify-center items-center'>
        <AnimatePresence initial={false} custom={currentImageIndex}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, display:"none" }}
            animate={{ opacity: 1, display:"inline", transition:{duration:2} }}
            exit={{ opacity: 0, display:"none" }}
            className="w-full h-1/2 relative"
          >
            <Image
              src={assets[currentImageIndex]}
              alt={`Image ${currentImageIndex}`}
              width={240}
              height={420}
              objectFit='cover'
              className='max-h-[500px]'
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Carousel;
