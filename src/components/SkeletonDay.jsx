import React from 'react';
import SkeletonCard from './SkeletonCard';
import './SkeletonDay.css';

const SkeletonDay = () => {
    const numCards = Math.floor(Math.random() * 3) + 2; // 2 to 4 cards

    return (
        <div className="skeleton-day">
            <div className="skeleton-day-header">
                <div className="skeleton-date"></div>
                <div className="skeleton-weekday"></div>
            </div>
            <div className="skeleton-events">
                {Array.from({ length: numCards }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
};

export default SkeletonDay;
