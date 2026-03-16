export const metadata = {
    title: "About - Kanyakumari School Directory",
    description: "Learn about the Kanyakumari School Directory and our mission to help parents find the best schools.",
};

export default function AboutPage() {
    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <span className="current">About</span>
                    </div>
                    <h1>ℹ️ About Us</h1>
                    <p>Our mission to help parents find the right school</p>
                </div>
            </div>

            <div className="container-narrow section">
                <div className="card" style={{ marginBottom: "2rem" }}>
                    <div className="card-body">
                        <h2 style={{ marginBottom: "1rem" }}>🎯 Our Mission</h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
                            The Kanyakumari School Directory is a comprehensive platform designed to help parents, students, and
                            educators easily find and compare schools in Kanyakumari District, Tamil Nadu.
                        </p>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                            We believe that finding the right school is one of the most important decisions a family can make.
                            Our directory provides detailed information about every school in the district — from government schools
                            to aided institutions — making it easier for parents to make informed choices about their children's education.
                        </p>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "2rem" }}>
                    <div className="card-body">
                        <h2 style={{ marginBottom: "1rem" }}>🌍 About Kanyakumari District</h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1rem" }}>
                            Kanyakumari District, located at the southernmost tip of mainland India, is known for its natural beauty,
                            cultural heritage, and commitment to education. The district comprises six taluks — Agastheeswaram, Kalkulam,
                            Killiyoor, Thiruvattar, Thovalai, and Vilavancode — each with a diverse range of educational institutions.
                        </p>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                            The district boasts a high literacy rate and hosts schools following various curricula including CBSE, ICSE,
                            Tamil Nadu State Board, and Matriculation, providing families with numerous choices for quality education.
                        </p>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "2rem" }}>
                    <div className="card-body">
                        <h2 style={{ marginBottom: "1rem" }}>✨ What We Offer</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                            {[
                                { icon: "🔍", title: "Search & Filter", desc: "Find schools by name, location, type, or curriculum" },
                                { icon: "🗺️", title: "Map View", desc: "See all schools on an interactive map" },
                                { icon: "📊", title: "Compare Schools", desc: "View detailed information to compare options" },
                                { icon: "📝", title: "Community Driven", desc: "Anyone can submit a school to be listed" },
                            ].map((item) => (
                                <div key={item.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                    <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                                    <div>
                                        <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{item.title}</h3>
                                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
