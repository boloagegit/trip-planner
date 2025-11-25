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

      <motion.div
        className="day-events"
        variants={{
          visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
          hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
        }}
        initial="hidden"
        animate="visible"
      >
        {day.events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          />
        ))}
        {day.events.length === 0 && (
          <div className="empty-day">
            No events planned
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DayView;
