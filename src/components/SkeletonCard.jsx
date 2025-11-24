import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-time"></div>
            <div className="skeleton-content">
                <div className="skeleton-header">
                    <div className="skeleton-icon"></div>
                    <div className="skeleton-title"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
