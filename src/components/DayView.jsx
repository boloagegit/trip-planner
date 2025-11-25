import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugSaucer } from '@fortawesome/free-solid-svg-icons';
import EventCard from './EventCard';
import './DayView.css';

const EMPTY_DAY_MESSAGES = {
  line1: '今天沒有安排活動，',
  line2: '好好休息一下吧！'
};

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
          <motion.div key={event.id} variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}>
            <EventCard
              event={event}
            />
          </motion.div>
        ))}
        {day.events.length === 0 && (
          <div className="empty-day">
            <FontAwesomeIcon icon={faMugSaucer} className="empty-day-icon" />
            <p>{EMPTY_DAY_MESSAGES.line1}</p>
            <p>{EMPTY_DAY_MESSAGES.line2}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DayView;
