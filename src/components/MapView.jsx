import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { geocodeEvents } from '../utils/geocoding';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import './MapView.css';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map center when markers change
const MapUpdater = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
};

const MapView = ({ itinerary }) => {
    const [geocodedEvents, setGeocodedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    useEffect(() => {
        const loadCoordinates = async () => {
            setLoading(true);

            // Flatten itinerary to get all events
            const allEvents = itinerary.flatMap(day =>
                day.events.map(event => ({
                    ...event,
                    date: day.date,
                    dayOfWeek: day.dayOfWeek
                }))
            );

            // Filter events that have locations
            const eventsWithLocation = allEvents.filter(e => e.location);
            setProgress({ current: 0, total: eventsWithLocation.length });

            const results = await geocodeEvents(eventsWithLocation, (current, total) => {
                setProgress({ current, total });
            });

            setGeocodedEvents(results);
            setLoading(false);
        };

        if (itinerary && itinerary.length > 0) {
            loadCoordinates();
        }
    }, [itinerary]);

    // Calculate map bounds
    const markers = geocodedEvents.map(e => [e.coordinates.lat, e.coordinates.lon]);

    // Default to Tokyo if no markers
    const defaultCenter = [35.6762, 139.6503];

    if (loading && geocodedEvents.length === 0) {
        return (
            <div className="map-loading">
                <div className="map-spinner"></div>
                <p>正在載入地圖座標...</p>
                {progress.total > 0 && (
                    <p className="map-progress">
                        {Math.round((progress.current / progress.total) * 100)}%
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="map-view-container">
            <MapContainer
                center={defaultCenter}
                zoom={11}
                scrollWheelZoom={true}
                className="leaflet-map"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {geocodedEvents.map((event, index) => (
                    <Marker
                        key={`${event.date}-${index}`}
                        position={[event.coordinates.lat, event.coordinates.lon]}
                    >
                        <Popup>
                            <div className="map-popup-content">
                                <h4>{event.title}</h4>
                                <p className="popup-time">{event.date} {event.time}</p>
                                <p className="popup-location">{event.location}</p>
                                {event.description && <p className="popup-desc">{event.description}</p>}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {markers.length > 0 && <MapUpdater bounds={markers} />}
            </MapContainer>
        </div>
    );
};

export default MapView;
