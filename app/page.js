import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import SchoolCard from "@/components/SchoolCard";
import { getFeaturedSchools, getRecentSchools, getStats } from "@/lib/queries";
import styles from "./home.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kanyakumarischools.in";

export default async function HomePage() {
  const featured = await getFeaturedSchools(8);
  const recent = await getRecentSchools(4);
  const stats = await getStats();

  const taluks = ["Agastheeswaram", "Kalkulam", "Killiyoor", "Thiruvattar", "Thovalai", "Vilavancode"];
  const types = [
    { label: "Government Schools", href: "/type/Government", icon: "🏛️", cls: "govt" },
    { label: "Aided Schools", href: "/type/Aided", icon: "🤝", cls: "aided" },
  ];
  const boards = [
    { label: "CBSE Schools", href: "/curriculum/CBSE", icon: "📘", cls: "cbse", desc: "Central Board of Secondary Education" },
    { label: "ICSE Schools", href: "/curriculum/ICSE", icon: "📗", cls: "icse", desc: "Indian Certificate of Secondary Education" },
    { label: "State Board Schools", href: "/curriculum/State Board", icon: "📙", cls: "state", desc: "Tamil Nadu State Board" },
  ];

  // FAQ Schema for Google rich results
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many schools are there in Kanyakumari District?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Kanyakumari District has ${stats.total}+ schools listed in our directory, including ${stats.government} Government schools and ${stats.aided} Aided schools across 6 taluks: Agastheeswaram, Kalkulam, Killiyoor, Thiruvattar, Thovalai, and Vilavancode.`,
        },
      },
      {
        "@type": "Question",
        name: "What education boards are available in Kanyakumari District?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Schools in Kanyakumari District offer four main education boards: CBSE (Central Board of Secondary Education), ICSE (Indian Certificate of Secondary Education), Tamil Nadu State Board, and Matriculation. Each board has its own curriculum, teaching methodology, and examination pattern.",
        },
      },
      {
        "@type": "Question",
        name: "What are the best CBSE schools in Nagercoil?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nagercoil has several excellent CBSE schools including Nagercoil Public School, Kanyakumari International School, and Christ The King CBSE School. These schools offer education from LKG/I to XII with modern facilities, experienced faculty, and strong academic records in CBSE board examinations.",
        },
      },
      {
        "@type": "Question",
        name: "Which taluks are in Kanyakumari District?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kanyakumari District comprises six taluks: Agastheeswaram (home to the administrative headquarters Nagercoil), Kalkulam (home to Padmanabhapuram Palace), Killiyoor, Thiruvattar (known for the ancient Sri Adikesavaperumal Temple), Thovalai, and Vilavancode. Each taluk has government and aided educational institutions.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroEmoji}>🎓</div>
          <h1 className={styles.heroTitle}>
            Find the Best <span>Schools</span> in Kanyakumari
          </h1>
          <p className={styles.heroSubtitle}>
            Explore {stats.total}+ Government and Aided schools across the district.
            Verified data, contact details, and locations at your fingertips.
          </p>
          <div className={styles.heroSearch}>
            <Search className={styles.searchIcon} size={20} />
            <form action="/schools" method="GET">
              <input
                type="text"
                name="search" // Keep name for form submission
                placeholder="Search by school name, village, or taluk..."
                autoComplete="off"
                className={styles.heroSearchInput}
                aria-label="Search schools by name, village, or taluk"
              />
            </form>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>{stats.total}</div>
              <div className={styles.heroStatLabel}>Total Schools</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>{stats.government}</div>
              <div className={styles.heroStatLabel}>Government</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>{stats.aided}</div>
              <div className={styles.heroStatLabel}>Aided</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>6</div>
              <div className={styles.heroStatLabel}>Taluks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className={styles.quickFilters}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Browse by Taluk</div>
            <div className={styles.filterPills}>
              {taluks.map((t) => (
                <Link key={t} href={`/taluk/${t}`} className={styles.filterPill}>
                  {t}
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Browse by Type</div>
            <div className={styles.filterPills}>
              <Link href="/type/Government" className={styles.filterPill}>🏛️ Government</Link>

              <Link href="/type/Aided" className={styles.filterPill}>🤝 Aided</Link>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Browse by Board</div>
            <div className={styles.filterPills}>
              <Link href="/curriculum/CBSE" className={styles.filterPill}>📘 CBSE</Link>
              <Link href="/curriculum/ICSE" className={styles.filterPill}>📗 ICSE</Link>
              <Link href="/curriculum/State Board" className={styles.filterPill}>📙 State Board</Link>
              <Link href="/curriculum/Matriculation" className={styles.filterPill}>📕 Matriculation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schools */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>⭐ Featured Schools in Kanyakumari District</h2>
            <Link href="/schools">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.schoolGrid}>
            {featured.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>📂 Explore School Categories</h2>
          </div>
          <div className={styles.categoryGrid}>
            {types.map((cat) => (
              <Link key={cat.href} href={cat.href} className={styles.categoryCard}>
                <div className={`${styles.categoryIcon} ${styles[cat.cls]}`}>
                  {cat.icon}
                </div>
                <div className={styles.categoryInfo}>
                  <h3>{cat.label}</h3>
                  <p>Browse all {cat.label.toLowerCase()}</p>
                </div>
              </Link>
            ))}
            {boards.map((cat) => (
              <Link key={cat.href} href={cat.href} className={styles.categoryCard}>
                <div className={`${styles.categoryIcon} ${styles[cat.cls]}`}>
                  {cat.icon}
                </div>
                <div className={styles.categoryInfo}>
                  <h3>{cat.label}</h3>
                  <p>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className={styles.recentSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>🆕 Recently Added Schools</h2>
            <Link href="/schools?sort=recent">
              See More <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.schoolGrid}>
            {recent.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section - visible to Google and users */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--gray-200)", padding: "3rem 0" }}>
        <div className="container-narrow">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>
            About Schools in Kanyakumari District
          </h2>
          <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9375rem" }}>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Kanyakumari District</strong>, situated at the southernmost tip of mainland India in <strong>Tamil Nadu</strong>,
              is one of the most literate districts in the state with a literacy rate exceeding 91%. The district is home to
              {stats.total}+ schools spread across its six taluks — <strong>Agastheeswaram, Kalkulam, Killiyoor, Thiruvattar, Thovalai, and Vilavancode</strong>.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              The district offers {stats.government} government schools providing free education and
              {stats.aided} government-aided schools offering quality education at affordable costs. Schools in the district
              primarily follow the <strong>Tamil Nadu State Board</strong> curriculum, with many also offering <strong>Matriculation</strong> education.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Agastheeswaram</strong> taluk, home to the administrative headquarters Nagercoil, has the highest concentration of schools.
              <strong>Kalkulam</strong> taluk houses the iconic Padmanabhapuram Palace. <strong>Killiyoor</strong> and <strong>Thiruvattar</strong> (with its ancient Sri Adikesavaperumal Temple) are important educational centers.
              <strong>Thovalai</strong> taluk, at the foot of the Western Ghats, and <strong>Vilavancode</strong> taluk also host diverse educational institutions.
            </p>
            <p>
              The Kanyakumari School Directory helps parents and students easily search, filter, and compare schools by location,
              school type, and curriculum. Use our <Link href="/map" style={{ color: "var(--primary-600)", fontWeight: 600 }}>interactive map</Link> to
              find schools near you, or browse by <Link href="/taluk" style={{ color: "var(--primary-600)", fontWeight: 600 }}>taluk</Link> and
              <Link href="/curriculum" style={{ color: "var(--primary-600)", fontWeight: 600 }}> curriculum</Link> to find the perfect school for your child.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

