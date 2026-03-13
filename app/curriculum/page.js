import Link from "next/link";
import { ArrowRight } from "lucide-react";

const boards = [
    {
        name: "CBSE",
        fullName: "Central Board of Secondary Education",
        desc: "CBSE is a national-level board of education in India. It prescribes a comprehensive curriculum with a balanced mix of academics and extracurricular activities.",
        icon: "📘",
        color: "#2563eb",
    },
    {
        name: "ICSE",
        fullName: "Indian Certificate of Secondary Education",
        desc: "ICSE is known for its comprehensive and balanced curriculum that focuses on the overall development of a child, including arts, sciences, and humanities.",
        icon: "📗",
        color: "#db2777",
    },
    {
        name: "State Board",
        fullName: "Tamil Nadu State Board of School Education",
        desc: "The Tamil Nadu State Board provides education in the state's regional languages and follows a curriculum standard set by the state government.",
        icon: "📙",
        color: "#0d9488",
    },
    {
        name: "Matriculation",
        fullName: "Tamil Nadu Matriculation Board",
        desc: "Matriculation schools follow a curriculum prescribed by the Tamil Nadu government with English as the primary medium of instruction.",
        icon: "📕",
        color: "#d97706",
    },
];

export const metadata = {
    title: "Education Boards & Curriculum - Kanyakumari School Directory",
    description: "Learn about different education boards available in Kanyakumari District: CBSE, ICSE, Tamil Nadu State Board, and Matriculation.",
};

export default function CurriculumOverviewPage() {
    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <span className="current">Curriculum</span>
                    </div>
                    <h1>📚 Education Boards & Curriculum</h1>
                    <p>Understanding the different education boards available in Kanyakumari District</p>
                </div>
            </div>

            <div className="container section">
                <div style={{ maxWidth: "800px", margin: "0 auto 3rem", textAlign: "center" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", lineHeight: 1.8 }}>
                        Schools in Kanyakumari District follow various education boards, each with its own teaching methodology,
                        examination pattern, and curriculum focus. Choose the right board based on your child's learning style and future goals.
                    </p>
                </div>

                <div className="grid grid-2">
                    {boards.map((board) => (
                        <Link key={board.name} href={`/curriculum/${board.name}`} className="card" style={{ textDecoration: "none" }}>
                            <div className="card-body">
                                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{board.icon}</div>
                                <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{board.name}</h2>
                                <p style={{ color: "var(--text-tertiary)", fontSize: "0.8125rem", marginBottom: "0.75rem" }}>{board.fullName}</p>
                                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>{board.desc}</p>
                                <span style={{ color: "var(--primary-600)", fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "4px" }}>
                                    View {board.name} Schools <ArrowRight size={14} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
