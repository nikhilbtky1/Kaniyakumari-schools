"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
    ssr: false,
    loading: () => <div style={{ height: "100%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Loading map...</div>
});

export default function DetailMap({ lat, lng }) {
    return <MapComponent lat={lat} lng={lng} zoom={15} style={{ height: "100%", minHeight: "260px" }} />;
}
