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

const DayView = ({ day, id, selectedOptions, onOptionSelect }) => {
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
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EventCard
              event={event}
              selectedOptions={selectedOptions}
              onOptionSelect={onOptionSelect}
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
      </div>
    </motion.div>
  );
};

export default DayView;
