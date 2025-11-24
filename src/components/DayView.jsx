import React from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import './DayView.css';

const DayView = ({ day, id }) => {
  return (
    <motion.div
      id={id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className="day-column"
    >
      <div className="day-header">
        <h2 className="day-date">{day.date}</h2>
        <span className="day-weekday">{day.dayOfWeek}</span>
      </div>

      <div className="day-events">
        {day.events.map(event => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}
        {day.events.length === 0 && (
          <div className="empty-day">
            No events planned
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DayView;
