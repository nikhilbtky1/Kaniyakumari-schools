import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

const taluks = [
    { name: "Agastheeswaram", desc: "The administrative headquarters of Kanyakumari District, home to Nagercoil city and the largest concentration of educational institutions in the district.", emoji: "🏙️", schools: "5+" },
    { name: "Kalkulam", desc: "Home to the historic Padmanabhapuram Palace, this taluk offers diverse government and aided schooling options.", emoji: "🏛️", schools: "4+" },
    { name: "Killiyoor", desc: "A taluk with well-established government schools serving both rural and semi-urban communities.", emoji: "🌿", schools: "4+" },
    { name: "Thiruvattar", desc: "Known for the ancient Sri Adikesavaperumal Temple, this taluk has both government and aided institutions with strong academic traditions.", emoji: "🛕", schools: "4+" },
    { name: "Thovalai", desc: "Located at the foot of the Western Ghats, this scenic taluk has government schools serving surrounding villages.", emoji: "⛰️", schools: "4+" },
    { name: "Vilavancode", desc: "A scenic taluk in the northern part of the district with government and aided schools including church-run institutions.", emoji: "🌴", schools: "5+" },
];

export const metadata = {
    title: "Schools by Taluk - Kanyakumari School Directory",
    description: "Browse schools in Kanyakumari District by taluk: Agastheeswaram, Kalkulam, Killiyoor, Thiruvattar, Thovalai, and Vilavancode.",
};

export default function TalukOverviewPage() {
    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <span className="current">Taluk-wise Schools</span>
                    </div>
                    <h1>Schools by Taluk</h1>
                    <p>Browse schools across all 6 taluks of Kanyakumari District</p>
                </div>
            </div>

            <div className="container section">
                <div className="grid grid-2">
                    {taluks.map((t) => (
                        <Link key={t.name} href={`/taluk/${t.name}`} className="card" style={{ textDecoration: "none" }}>
                            <div className="card-body">
                                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{t.emoji}</div>
                                <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Schools in {t.name}</h2>
                                <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>{t.desc}</p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span className="badge badge-cbse">{t.schools} Schools</span>
                                    <span style={{ color: "var(--primary-600)", fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "4px" }}>
                                        View Schools <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
