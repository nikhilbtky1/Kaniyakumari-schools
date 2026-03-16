import Link from "next/link";
import { getSchoolsByTaluk } from "@/lib/queries";
import SchoolCard from "@/components/SchoolCard";

const talukInfo = {
    Agastheeswaram: { desc: "Agastheeswaram is the administrative hub of Kanyakumari District, home to Nagercoil city and a major center for government and aided educational institutions.", emoji: "🏙️" },
    Kalkulam: { desc: "Kalkulam taluk is home to the historic Padmanabhapuram Palace. It offers government and aided schools providing quality education from primary to higher secondary.", emoji: "🏛️" },
    Killiyoor: { desc: "Killiyoor is a taluk with well-established government schools serving rural and semi-urban communities across the central part of the district.", emoji: "🌿" },
    Thiruvattar: { desc: "Thiruvattar taluk is known for the ancient Sri Adikesavaperumal Temple. It has a rich educational tradition with both government and aided institutions.", emoji: "🛕" },
    Thovalai: { desc: "Thovalai taluk, situated at the foot of the Western Ghats, has well-maintained government schools serving local communities in a scenic environment.", emoji: "⛰️" },
    Vilavancode: { desc: "Vilavancode is a scenic taluk in the northern part of Kanyakumari District, with both government and church-run aided educational institutions.", emoji: "🌴" },
};

export async function generateMetadata({ params }) {
    const { taluk } = await params;
    const name = decodeURIComponent(taluk);
    return {
        title: `Schools in ${name} - Kanyakumari School Directory`,
        description: `Browse all government and aided schools in ${name} taluk, Kanyakumari District.`,
    };
}

export default async function TalukDetailPage({ params }) {
    const { taluk } = await params;
    const talukName = decodeURIComponent(taluk);
    const schools = await getSchoolsByTaluk(talukName);
    const info = talukInfo[talukName] || { desc: `Schools in ${talukName} taluk of Kanyakumari District.`, emoji: "📍" };

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <a href="/taluk">Taluk-wise</a><span>/</span>
                        <span className="current">{talukName}</span>
                    </div>
                    <h1>{info.emoji} Schools in {talukName}</h1>
                    <p>{info.desc}</p>
                </div>
            </div>

            <div className="container section">
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                    Showing <strong>{schools.length}</strong> schools in {talukName} taluk
                </p>

                {schools.length === 0 ? (
                    <div className="empty-state">
                        <h3>No schools found</h3>
                        <p>No schools have been added for this taluk yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {schools.map((school) => (
                            <SchoolCard key={school.id} school={school} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
