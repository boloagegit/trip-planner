import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import './DateNavigation.css';

const DateNavigation = ({ itinerary, onDateClick }) => {
    const [activeDate, setActiveDate] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Track which date is currently visible
    useEffect(() => {
        if (!itinerary || itinerary.length === 0) return;

        // Set initial active date
        if (!activeDate) {
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            const formattedToday = `${month}/${day}`;
            const todayInItinerary = itinerary.find(d => d.date === formattedToday);

            if (todayInItinerary) {
                setTimeout(() => setActiveDate(formattedToday), 0);
                const index = itinerary.findIndex(d => d.date === formattedToday);
                onDateClick(index);
            } else {
                setTimeout(() => setActiveDate(itinerary[0].date), 0);
                onDateClick(0);
            }
        }

        const handleScroll = () => {
            const container = document.getElementById('days-container');
            if (!container) return;

            // Find which day column is most visible
            const dayColumns = container.querySelectorAll('.day-column');
            let mostVisibleDay = null;
            let maxVisibility = 0;

            dayColumns.forEach((col, index) => {
                const rect = col.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                // Calculate how much of the element is visible
                const visibleWidth = Math.min(rect.right, containerRect.right) - Math.max(rect.left, containerRect.left);
                const visibility = visibleWidth / rect.width;

                if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    mostVisibleDay = itinerary[index]?.date;
                }
            });

            if (mostVisibleDay && mostVisibleDay !== activeDate) {
                setActiveDate(mostVisibleDay);
            }
        };

        const container = document.getElementById('days-container');
        if (container) {
            container.addEventListener('scroll', handleScroll);
            // Initial check
            handleScroll();
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [itinerary, activeDate, onDateClick]);

    const handleDateClick = (date, index) => {
        setActiveDate(date);
        onDateClick(index);
        setIsDropdownOpen(false);
    };

    if (!itinerary || itinerary.length === 0) return null;

    // Mobile: Custom Dropdown
    if (isMobile) {
        const currentDay = itinerary.find(day => day.date === activeDate) || itinerary[0];

        return (
            <div className="date-navigation-mobile">
                <div className="date-dropdown">
                    <button
                        className="date-dropdown-trigger"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <FontAwesomeIcon icon={faCalendarDay} className="dropdown-icon" />
                        <div className="dropdown-current">
                            <span className="dropdown-date">{currentDay.date}</span>
                            <span className="dropdown-weekday">{currentDay.dayOfWeek}</span>
                        </div>
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                        />
                    </button>

                    {isDropdownOpen && (
                        <div className="date-dropdown-menu">
                            {itinerary.map((day, index) => (
                                <button
                                    key={day.date}
                                    className={`date-dropdown-item ${activeDate === day.date ? 'active' : ''}`}
                                    onClick={() => handleDateClick(day.date, index)}
                                >
                                    <span className="dropdown-item-date">{day.date}</span>
                                    <span className="dropdown-item-weekday">{day.dayOfWeek}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Desktop: Horizontal scroll menu
    return (
        <div className="date-navigation">
            <div className="date-nav-container">
                {itinerary.map((day, index) => (
                    <button
                        key={day.date}
                        className={`date-nav-button ${activeDate === day.date ? 'active' : ''}`}
                        onClick={() => handleDateClick(day.date, index)}
                    >
                        <span className="date-nav-date">{day.date}</span>
                        <span className="date-nav-weekday">{day.dayOfWeek}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DateNavigation;
