'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReviewsCarousel({ items = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Use items passed from props, or fallback to empty if none (though parent should provide defaults)
    const reviews = items.length > 0 ? items : [
        {
            id: 1,
            text: "Отзывов пока нет.",
            author: "Администратор"
        }
    ];


    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = reviews.length - 1;
            if (nextIndex >= reviews.length) nextIndex = 0;
            return nextIndex;
        });
    };

    return (
        <div className="carousel-container" style={{ position: 'relative', minHeight: '400px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden', paddingTop: '2rem' }}>
            <button
                className="carousel__btn carousel__btn--prev"
                onClick={() => paginate(-1)}
                style={{ zIndex: 2, top: '40%' }}
            >
                <ChevronLeft />
            </button>

            <div style={{ width: '100%', maxWidth: '700px', position: 'relative', height: '350px' }}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            textAlign: 'center'
                        }}
                    >
                        <blockquote className="review">
                            <p className="review__text">"{reviews[currentIndex].text}"</p>
                            <cite className="review__author">— {reviews[currentIndex].author}</cite>
                        </blockquote>
                    </motion.div>
                </AnimatePresence>
            </div>

            <button
                className="carousel__btn carousel__btn--next"
                onClick={() => paginate(1)}
                style={{ zIndex: 2, top: '40%' }}
            >
                <ChevronRight />
            </button>

            <div className="carousel__nav" style={{ position: 'absolute', bottom: '30px' }}>
                {reviews.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel__indicator ${index === currentIndex ? 'current-slide' : ''}`}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
