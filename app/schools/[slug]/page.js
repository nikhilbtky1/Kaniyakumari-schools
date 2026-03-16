import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Globe, BookOpen, Calendar, Building2, Star } from "lucide-react";
import { getSchoolBySlug, getNearbySchools } from "@/lib/queries";
import SchoolCard from "@/components/SchoolCard";
import styles from "./detail.module.css";
import DetailMap from "./DetailMap";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kanyakumarischools.in";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const school = await getSchoolBySlug(slug);
    if (!school) return { title: "School Not Found" };

    const title = `${school.school_name} – ${school.school_type} ${school.board} School in ${school.village}, ${school.taluk}`;
    const description = `${school.school_name} is a ${school.school_type.toLowerCase()} ${school.board} school located in ${school.village}, ${school.taluk} taluk, Kanyakumari District, Tamil Nadu. Classes offered: ${school.classes_available}. ${school.description ? school.description.slice(0, 150) + '...' : `Find address, phone, email, map location and more details.`}`;

    return {
        title,
        description,
        keywords: [
            school.school_name,
            `${school.school_name} ${school.village}`,
            `${school.board} schools in ${school.taluk}`,
            `${school.school_type} schools ${school.taluk}`,
            `schools in ${school.village}`,
            `${school.board} school ${school.village}`,
            `best schools in ${school.taluk}`,
            `${school.school_type} school Kanyakumari`,
            `school admission ${school.taluk}`,
        ].join(", "),
        openGraph: {
            title: `${school.school_name} – ${school.board} School in ${school.taluk}, Kanyakumari`,
            description,
            url: `${SITE_URL}/schools/${school.slug}`,
            type: "website",
        },
        alternates: {
            canonical: `${SITE_URL}/schools/${school.slug}`,
        },
    };
}

function getBadgeClass(type) {
    const map = { Government: "badge-government", Private: "badge-private", Aided: "badge-aided" };
    return map[type] || "";
}
function getBoardBadgeClass(b) {
    const map = { CBSE: "badge-cbse", ICSE: "badge-icse", "State Board": "badge-state-board", Matriculation: "badge-matriculation" };
    return map[b] || "";
}

export default async function SchoolDetailPage({ params }) {
    const { slug } = await params;
    const school = await getSchoolBySlug(slug);

    if (!school) {
        return (
            <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
                <h1>School Not Found</h1>
                <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>The school you're looking for doesn't exist.</p>
                <Link href="/schools" className="btn btn-primary" style={{ marginTop: "2rem" }}>Browse All Schools</Link>
            </div>
        );
    }

    const nearby = school.latitude && school.longitude
        ? await getNearbySchools(school.latitude, school.longitude, school.id, 4)
        : [];

    // JSON-LD Schema.org structured data for Google rich results
    const schoolJsonLd = {
        "@context": "https://schema.org",
        "@type": "School",
        name: school.school_name,
        description: school.description || `${school.school_name} is a ${school.school_type} school in ${school.village}, ${school.taluk}, Kanyakumari District following ${school.board} curriculum.`,
        url: `${SITE_URL}/schools/${school.slug}`,
        address: {
            "@type": "PostalAddress",
            streetAddress: school.address,
            addressLocality: school.village,
            addressRegion: "Tamil Nadu",
            postalCode: school.pincode,
            addressCountry: "IN",
        },
        ...(school.latitude && school.longitude && {
            geo: {
                "@type": "GeoCoordinates",
                latitude: school.latitude,
                longitude: school.longitude,
            },
        }),
        ...(school.phone && { telephone: school.phone }),
        ...(school.email && { email: school.email }),
        ...(school.website && { sameAs: school.website }),
        areaServed: {
            "@type": "AdministrativeArea",
            name: `${school.taluk}, Kanyakumari District, Tamil Nadu`,
        },
        additionalProperty: [
            { "@type": "PropertyValue", name: "School Type", value: school.school_type },
            { "@type": "PropertyValue", name: "Board/Curriculum", value: school.board },
            { "@type": "PropertyValue", name: "Classes", value: school.classes_available },
            ...(school.udise_code ? [{ "@type": "PropertyValue", name: "UDISE Code", value: school.udise_code }] : []),
        ],
    };

    // BreadcrumbList structured data
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Schools", item: `${SITE_URL}/schools` },
            { "@type": "ListItem", position: 3, name: school.school_name, item: `${SITE_URL}/schools/${school.slug}` },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <a href="/schools">Schools</a><span>/</span>
                        <span className="current">{school.school_name}</span>
                    </div>
                    <h1>{school.school_name}</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                        <span>{school.village}, {school.taluk} — {school.board}</span>
                        {school.rating > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#fbbf24" }}>
                                <Star size={16} fill="currentColor" />
                                <span style={{ fontWeight: 600 }}>{school.rating}</span>
                                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>({school.reviews} reviews)</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.detailContainer}>
                <Link href="/schools" className={styles.backLink}>
                    <ArrowLeft size={16} /> Back to All Schools
                </Link>

                <div className={styles.detailGrid}>
                    {/* Main Info */}
                    <div className={styles.mainInfo}>
                        <div className={styles.detailCard}>
                            <div className={styles.badges}>
                                <span className={`badge ${getBadgeClass(school.school_type)}`}>{school.school_type}</span>
                                <span className={`badge ${getBoardBadgeClass(school.board)}`}>{school.board}</span>
                            </div>

                            {school.description && (
                                <div className={styles.descriptionSection}>
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        📖 About This School
                                    </h2>
                                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.85, fontSize: "0.9675rem" }}>
                                        {school.description}
                                    </p>
                                </div>
                            )}

                            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>School Information</h2>

                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="label">School Name</span>
                                    <span className="value">{school.school_name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">School Type</span>
                                    <span className="value">{school.school_type}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Board / Curriculum</span>
                                    <span className="value">{school.board}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Classes Available</span>
                                    <span className="value">{school.classes_available}</span>
                                </div>
                                {school.udise_code && (
                                    <div className="info-item">
                                        <span className="label">UDISE Code</span>
                                        <span className="value">{school.udise_code}</span>
                                    </div>
                                )}
                                <div className="info-item">
                                    <span className="label">Address</span>
                                    <span className="value">{school.address}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Village</span>
                                    <span className="value">{school.village}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Taluk</span>
                                    <span className="value">{school.taluk}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">District</span>
                                    <span className="value">{school.district}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Pincode</span>
                                    <span className="value">{school.pincode}</span>
                                </div>
                            </div>

                            <div className={styles.updatedAt}>
                                Last updated: {new Date(school.updated_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className={`${styles.detailCard} ${styles.sidebarCard}`}>
                            {/* Map */}
                            {school.latitude && school.longitude && (
                                <div className={styles.mapContainer}>
                                    <DetailMap lat={school.latitude} lng={school.longitude} />
                                </div>
                            )}

                            {/* Contact */}
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Contact Information</h3>
                            <div className={styles.contactList}>
                                {school.phone && (
                                    <div className={styles.contactItem}>
                                        <Phone size={16} />
                                        <a href={`tel:${school.phone}`}>{school.phone}</a>
                                    </div>
                                )}
                                {school.email && (
                                    <div className={styles.contactItem}>
                                        <Mail size={16} />
                                        <a href={`mailto:${school.email}`}>{school.email}</a>
                                    </div>
                                )}
                                {school.website && (
                                    <div className={styles.contactItem}>
                                        <Globe size={16} />
                                        <a href={school.website} target="_blank" rel="noopener noreferrer">{school.website}</a>
                                    </div>
                                )}
                                <div className={styles.contactItem}>
                                    <MapPin size={16} />
                                    <span>{school.address}, {school.village}, {school.taluk}, {school.district} - {school.pincode}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nearby Schools */}
                {nearby.length > 0 && (
                    <div className={styles.nearbySection}>
                        <h2>📍 Nearby Schools</h2>
                        <div className={styles.nearbyGrid}>
                            {nearby.map((s) => (
                                <SchoolCard key={s.id} school={s} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
