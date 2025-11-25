import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUtensils, faTrain, faBed, faBagShopping, faMapPin, faLocationArrow
} from '@fortawesome/free-solid-svg-icons';
import './EventCard.css';

const EventCard = ({ event }) => {
    const { title, displayTime, time, type, description, location } = event;

    const getTypeIcon = (type) => {
        switch (type) {
            case 'food': return <FontAwesomeIcon icon={faUtensils} />;
            case 'transport': return <FontAwesomeIcon icon={faTrain} />;
            case 'hotel': return <FontAwesomeIcon icon={faBed} />;
            case 'shopping': return <FontAwesomeIcon icon={faBagShopping} />;
            default: return <FontAwesomeIcon icon={faMapPin} />;
        }
    };

    // Extract ALL locations with map emoji from text
    const extractMapLocations = (text) => {
        if (!text) return [];
        const locations = [];
        const parts = text.split('🗺️');
        // Start from the second part, as the first part is text before the first emoji
        for (let i = 1; i < parts.length; i++) {
            // Take the content up to the first newline
            const locationText = parts[i].split('\n')[0].trim();
            if (locationText) {
                locations.push(locationText);
            }
        }
        return locations;
    };

    // Remove map emoji from text for display
    const removeMapEmoji = (text) => {
        if (!text) return text;
        // Remove all instances of 🗺️ and optional following space
        return text.replace(/🗺️\s*/gu, '');
    };

    // Collect all map locations from title, description, and location
    const allMapLocations = [
        ...extractMapLocations(title),
        ...extractMapLocations(description),
        ...extractMapLocations(location)
    ];

    // Clean display text (remove map emoji)
    const cleanTitle = removeMapEmoji(title);
    const cleanDescription = removeMapEmoji(description);
    const cleanLocation = removeMapEmoji(location);

    const openGoogleMaps = (locationName) => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
        window.open(mapsUrl, '_blank');
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`event-card ${type}`}
        >
            <div className="event-time-column">
                <span className="event-time">{displayTime || time}</span>
            </div>

            <div className="event-content">
                <div className="event-header">
                    <span className="event-icon">{getTypeIcon(type)}</span>
                    <h3 className="event-title">{cleanTitle}</h3>
                </div>

                {cleanDescription && <p className="event-description">{cleanDescription}</p>}

                {/* Map Locations - support multiple */}
                {allMapLocations.length > 0 && (
                    <div className="event-meta">
                        {allMapLocations.map((loc, index) => (
                            <button
                                key={index}
                                className="map-location-btn"
                                onClick={() => openGoogleMaps(loc)}
                                title="在 Google Maps 中查看"
                            >
                                <span>{loc}</span>
                                <FontAwesomeIcon icon={faLocationArrow} className="external-icon" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Regular location (no map emoji) */}
                {!allMapLocations.length && cleanLocation && (
                    <div className="event-meta">
                        <FontAwesomeIcon icon={faMapPin} className="meta-icon" />
                        <span>{cleanLocation}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default EventCard;
