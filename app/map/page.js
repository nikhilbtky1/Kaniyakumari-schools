"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
    ssr: false,
    loading: () => (
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", color: "#94a3b8" }}>
            <div className="spinner" />
        </div>
    ),
});

export default function MapPage() {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/schools?limit=100")
            .then((r) => r.json())
            .then((data) => {
                setSchools(data.schools || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const markers = schools
        .filter((s) => s.latitude && s.longitude)
        .map((s) => ({
            lat: s.latitude,
            lng: s.longitude,
            popup: `
        <div style="min-width:180px">
          <strong style="font-size:14px">${s.school_name}</strong><br/>
          <span style="font-size:12px;color:#64748b">${s.school_type} · ${s.board}</span><br/>
          <span style="font-size:12px;color:#64748b">${s.village}, ${s.taluk}</span><br/>
          <a href="/schools/${s.slug}" style="color:#2563eb;font-size:13px;font-weight:600">View Details →</a>
        </div>
      `,
        }));

    return (
        <>
            <div className="page-header" style={{ padding: "2rem 0 1.5rem" }}>
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <span className="current">Map View</span>
                    </div>
                    <h1>🗺️ School Map</h1>
                    <p>Interactive map showing all {schools.length} schools in Kanyakumari District</p>
                </div>
            </div>
            <div style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}>
                {loading ? (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="spinner" />
                    </div>
                ) : (
                    <MapComponent
                        lat={8.22}
                        lng={77.33}
                        zoom={10}
                        markers={markers}
                        style={{ height: "100%", width: "100%" }}
                    />
                )}
            </div>
        </>
    );
}
