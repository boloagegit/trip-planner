import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUtensils, faTrain, faBed, faBagShopping, faMapPin, faLocationArrow, faLink, faCheck
} from '@fortawesome/free-solid-svg-icons';
import './EventCard.css';

const EventCard = ({ event, selectedOptions, onOptionSelect }) => {
    const { title, displayTime, time, type, description, location, options, id } = event;

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

        // Find all matches of 🗺️ followed by location name
        const mapEmojiPattern = /🗺️\s*([^\n🗺️]+)/gu;
        const locations = [];
        let match;

        while ((match = mapEmojiPattern.exec(text)) !== null) {
            if (match[1]) {
                // Trim and clean up the location name (remove the emoji)
                const cleanLocation = match[1].trim();
                if (cleanLocation) {
                    locations.push(cleanLocation);
                }
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

    // Extract URLs from text
    const extractUrls = (text) => {
        if (!text) return [];
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        return text.match(urlPattern) || [];
    };

    // Remove URLs from text for display
    const removeUrls = (text) => {
        if (!text) return text;
        return text.replace(/(https?:\/\/[^\s]+)/g, '').trim();
    };

    // Collect all map locations
    const allMapLocations = [
        ...extractMapLocations(title),
        ...extractMapLocations(description),
        ...extractMapLocations(location)
    ];

    // Collect all URLs
    const allUrls = [
        ...extractUrls(title),
        ...extractUrls(description),
        ...extractUrls(location)
    ];

    // Clean display text (remove map emoji AND URLs)
    const cleanTitle = removeUrls(removeMapEmoji(title));
    const cleanDescription = removeUrls(removeMapEmoji(description));
    const cleanLocation = removeUrls(removeMapEmoji(location));

    const openGoogleMaps = (locationName) => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
        window.open(mapsUrl, '_blank');
    };

    const getDomain = (url) => {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch (e) {
            return 'Link';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 0 }}
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

                {/* Options List */}
                {options && (
                    <div className="event-options-list">
                        {options.map((opt, idx) => {
                            const isSelected = selectedOptions && selectedOptions[id] === opt.label;
                            return (
                                <button
                                    key={idx}
                                    className={`event-option-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => onOptionSelect && onOptionSelect(id, opt.label)}
                                >
                                    <div className="option-label">{opt.label}</div>
                                    <div className="option-value">{opt.value}</div>
                                    {isSelected && <FontAwesomeIcon icon={faCheck} className="option-check" />}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Action Buttons Container */}
                {(allMapLocations.length > 0 || allUrls.length > 0) && (
                    <div className="event-meta">
                        {/* Map Locations */}
                        {allMapLocations.map((loc, index) => (
                            <button
                                key={`map-${index}`}
                                className="map-location-btn"
                                onClick={() => openGoogleMaps(loc)}
                                title="在 Google Maps 中查看"
                            >
                                <span>{loc}</span>
                                <FontAwesomeIcon icon={faLocationArrow} className="external-icon" />
                            </button>
                        ))}

                        {/* URL Links */}
                        {allUrls.map((url, index) => (
                            <a
                                key={`link-${index}`}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="map-location-btn link-btn"
                                title={url}
                            >
                                <span>{getDomain(url)}</span>
                                <FontAwesomeIcon icon={faLink} className="external-icon" />
                            </a>
                        ))}
                    </div>
                )}

                {/* Regular location (no map emoji and no links) */}
                {!allMapLocations.length && !allUrls.length && cleanLocation && (
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
