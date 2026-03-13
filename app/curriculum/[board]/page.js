import Link from "next/link";
import { getSchoolsByBoard } from "@/lib/queries";
import SchoolCard from "@/components/SchoolCard";

const boardDetails = {
    CBSE: {
        fullName: "Central Board of Secondary Education",
        emoji: "📘",
        overview: "The Central Board of Secondary Education (CBSE) is one of the most popular education boards in India. Established in 1962, CBSE prescribes a nationwide curriculum and conducts examinations for classes X and XII.",
        teachingStyle: "CBSE follows a comprehensive approach with a focus on conceptual learning. The curriculum emphasizes practical knowledge and application-based learning. Regular assessments and continuous evaluation help track student progress.",
        subjects: ["English", "Hindi/Tamil/Sanskrit", "Mathematics", "Science (Physics, Chemistry, Biology)", "Social Science", "Computer Science", "Physical Education", "Art & Craft"],
    },
    ICSE: {
        fullName: "Indian Certificate of Secondary Education",
        emoji: "📗",
        overview: "The Indian Certificate of Secondary Education (ICSE) is conducted by the Council for the Indian School Certificate Examination (CISCE). Known for its well-rounded curriculum, ICSE places equal emphasis on science, arts, and humanities.",
        teachingStyle: "ICSE follows a detailed and comprehensive curriculum that encourages analytical thinking and practical learning. Internal assessments and project work form a significant part of the evaluation process.",
        subjects: ["English", "Second Language", "Mathematics", "Physics", "Chemistry", "Biology", "History & Civics", "Geography", "Environmental Science", "Computer Applications"],
    },
    "State Board": {
        fullName: "Tamil Nadu State Board of School Education",
        emoji: "📙",
        overview: "The Tamil Nadu State Board governs the school education system in Tamil Nadu. It provides education primarily in Tamil and English mediums, following a curriculum developed by the state government.",
        teachingStyle: "The State Board curriculum provides a strong foundation in regional language and culture while covering all essential subjects. The new syllabus has been updated to be more application-oriented and student-friendly.",
        subjects: ["Tamil", "English", "Mathematics", "Science", "Social Science", "Physical Education", "Work Experience", "Art Education"],
    },
    Matriculation: {
        fullName: "Tamil Nadu Matriculation Board",
        emoji: "📕",
        overview: "Matriculation schools in Tamil Nadu follow a curriculum prescribed by the state government with English as the primary medium of instruction. These schools provide quality education that bridges regional and national educational standards.",
        teachingStyle: "Matriculation schools emphasize English-medium education while maintaining a connection to regional culture and language. The teaching approach balances theoretical knowledge with practical applications.",
        subjects: ["English", "Tamil", "Mathematics", "Science", "Social Science", "Computer Science", "General Knowledge", "Physical Education"],
    },
};

export async function generateMetadata({ params }) {
    const { board } = await params;
    const name = decodeURIComponent(board);
    return {
        title: `${name} Schools - Kanyakumari School Directory`,
        description: `Find ${name} curriculum schools in Kanyakumari District. Learn about the ${name} teaching style and explore affiliated schools.`,
    };
}

export default async function BoardDetailPage({ params }) {
    const { board } = await params;
    const boardName = decodeURIComponent(board);
    const schools = getSchoolsByBoard(boardName);
    const info = boardDetails[boardName] || {
        fullName: boardName,
        emoji: "📚",
        overview: `${boardName} curriculum schools in Kanyakumari District.`,
        teachingStyle: "Information about this board's teaching style.",
        subjects: [],
    };

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <a href="/curriculum">Curriculum</a><span>/</span>
                        <span className="current">{boardName}</span>
                    </div>
                    <h1>{info.emoji} {boardName} Curriculum</h1>
                    <p>{info.fullName}</p>
                </div>
            </div>

            <div className="container section">
                {/* Overview */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
                    <div className="card">
                        <div className="card-body">
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>📖 Overview</h2>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{info.overview}</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>🎓 Teaching Style</h2>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{info.teachingStyle}</p>
                        </div>
                    </div>
                </div>

                {/* Subjects */}
                {info.subjects.length > 0 && (
                    <div className="card" style={{ marginBottom: "3rem" }}>
                        <div className="card-body">
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>📋 Typical Subjects</h2>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {info.subjects.map((subj) => (
                                    <span key={subj} className="filter-chip">{subj}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Schools */}
                <h2 style={{ marginBottom: "1.5rem" }}>🏫 {boardName} Schools in Kanyakumari ({schools.length})</h2>
                {schools.length === 0 ? (
                    <div className="empty-state">
                        <h3>No schools found</h3>
                        <p>No {boardName} schools have been added yet.</p>
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
