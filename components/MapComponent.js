"use client";

import { useEffect, useRef } from "react";

export default function MapComponent({ lat, lng, zoom = 15, markers = [], style = {} }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Dynamically import leaflet
        const loadMap = async () => {
            const L = (await import("leaflet")).default;
            await import("leaflet/dist/leaflet.css");

            // Fix marker icons
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
            });

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }

            const map = L.map(mapRef.current).setView([lat || 8.1833, lng || 77.4119], zoom);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            if (markers.length > 0) {
                const bounds = [];
                markers.forEach((m) => {
                    if (m.lat && m.lng) {
                        const marker = L.marker([m.lat, m.lng]).addTo(map);
                        if (m.popup) {
                            marker.bindPopup(m.popup);
                        }
                        bounds.push([m.lat, m.lng]);
                    }
                });
                if (bounds.length > 1) {
                    map.fitBounds(bounds, { padding: [30, 30] });
                }
            } else if (lat && lng) {
                L.marker([lat, lng]).addTo(map);
            }

            mapInstanceRef.current = map;

            // Fix map rendering in container
            setTimeout(() => map.invalidateSize(), 100);
        };

        loadMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lng, zoom, markers]);

    return <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: "300px", ...style }} />;
}
