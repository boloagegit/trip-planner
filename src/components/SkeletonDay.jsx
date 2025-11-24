import React from 'react';
import SkeletonCard from './SkeletonCard';
import './SkeletonDay.css';

const SkeletonDay = () => {
    return (
        <div className="skeleton-day">
            <div className="skeleton-day-header">
                <div className="skeleton-date"></div>
                <div className="skeleton-weekday"></div>
            </div>
            <div className="skeleton-events">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
};

export default SkeletonDay;
