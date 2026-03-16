import Link from "next/link";
import { getSchoolsByType } from "@/lib/queries";
import SchoolCard from "@/components/SchoolCard";

const typeInfo = {
    Government: { desc: "Government schools in Kanyakumari District are funded and managed by the Tamil Nadu state government, offering free education to students.", emoji: "🏛️", color: "badge-government" },
    Aided: { desc: "Government-aided schools receive financial assistance from the government while being privately managed, providing affordable quality education.", emoji: "🤝", color: "badge-aided" },
};

export async function generateMetadata({ params }) {
    const { type } = await params;
    const name = decodeURIComponent(type);
    return {
        title: `${name} Schools - Kanyakumari School Directory`,
        description: `Browse all ${name.toLowerCase()} schools in Kanyakumari District, Tamil Nadu.`,
    };
}

export default async function TypePage({ params }) {
    const { type } = await params;
    const typeName = decodeURIComponent(type);
    const schools = await getSchoolsByType(typeName);
    const info = typeInfo[typeName] || { desc: `${typeName} schools in Kanyakumari District.`, emoji: "🏫", color: "" };

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <span className="current">{typeName} Schools</span>
                    </div>
                    <h1>{info.emoji} {typeName} Schools</h1>
                    <p>{info.desc}</p>
                </div>
            </div>

            <div className="container section">
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                    Showing <strong>{schools.length}</strong> {typeName.toLowerCase()} schools
                </p>
                {schools.length === 0 ? (
                    <div className="empty-state">
                        <h3>No schools found</h3>
                        <p>No {typeName.toLowerCase()} schools have been added yet.</p>
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
