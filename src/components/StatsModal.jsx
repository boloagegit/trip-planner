import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCalendarDays, faLocationDot, faUtensils, faTrain } from '@fortawesome/free-solid-svg-icons';
import './StatsModal.css';

const StatsModal = ({ isOpen, onClose, stats }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="stats-modal-backdrop"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -20 }}
                    className="stats-modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="stats-modal-close" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>

                    <h2>📊 行程統計</h2>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <FontAwesomeIcon icon={faCalendarDays} className="stat-card-icon" />
                            <div className="stat-card-content">
                                <span className="stat-card-value">{stats.totalDays}</span>
                                <span className="stat-card-label">天</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <FontAwesomeIcon icon={faLocationDot} className="stat-card-icon" />
                            <div className="stat-card-content">
                                <span className="stat-card-value">{stats.totalEvents}</span>
                                <span className="stat-card-label">活動</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <FontAwesomeIcon icon={faUtensils} className="stat-card-icon" />
                            <div className="stat-card-content">
                                <span className="stat-card-value">{stats.foodCount}</span>
                                <span className="stat-card-label">用餐</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <FontAwesomeIcon icon={faTrain} className="stat-card-icon" />
                            <div className="stat-card-content">
                                <span className="stat-card-value">{stats.transportCount}</span>
                                <span className="stat-card-label">交通</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default StatsModal;
