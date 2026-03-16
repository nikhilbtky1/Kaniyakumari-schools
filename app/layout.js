import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kaniyakumari-schools.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kanyakumari School Directory – Find Best Schools in Kanyakumari District, Tamil Nadu",
    template: "%s | Kanyakumari School Directory",
  },
  description:
    "Complete directory of Government and Aided schools in Kanyakumari District, Tamil Nadu. Search & compare schools across 6 taluks: Agastheeswaram, Kalkulam, Killiyoor, Thiruvattar, Thovalai, Vilavancode. State Board & Matriculation schools with contact, location & details.",
  keywords: [
    "schools in Kanyakumari",
    "Kanyakumari schools",
    "Kanyakumari district schools",
    "Nagercoil schools",
    "schools in Nagercoil",
    "CBSE schools in Kanyakumari",
    "ICSE schools Kanyakumari",
    "State Board schools Kanyakumari",
    "Matriculation schools Kanyakumari",
    "private schools Nagercoil",
    "government schools Kanyakumari",
    "aided schools Kanyakumari",
    "best schools in Kanyakumari district",
    "schools in Agastheeswaram",
    "schools in Killiyoor",
    "schools in Thiruvattar",
    "schools in Thovalai",
    "schools in Colachel",
    "schools in Marthandam",
    "schools near Nagercoil",
    "Tamil Nadu schools directory",
    "school admission Kanyakumari",
    "top schools Kanyakumari district",
    "Kanyakumari school list",
    "primary schools Kanyakumari",
    "high school Kanyakumari",
    "higher secondary school Kanyakumari",
  ],
  authors: [{ name: "Kanyakumari School Directory" }],
  creator: "Kanyakumari School Directory",
  publisher: "Kanyakumari School Directory",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Kanyakumari School Directory",
    title: "Kanyakumari School Directory – Find Best Schools in Kanyakumari District",
    description:
      "Complete directory of Government and Aided schools in Kanyakumari District, Tamil Nadu. Search across 6 taluks: Agastheeswaram, Kalkulam, Killiyoor, Thiruvattar, Thovalai & Vilavancode. State Board & Matriculation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kanyakumari School Directory - Find the Best Schools in Kanyakumari District",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanyakumari School Directory – Find Best Schools in Kanyakumari District",
    description:
      "Complete directory of schools in Kanyakumari District, Tamil Nadu. Search & compare CBSE, ICSE, State Board & Matriculation schools.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "Education",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kanyakumari School Directory",
    url: SITE_URL,
    description:
      "Complete directory of Government and Aided schools in Kanyakumari District, Tamil Nadu.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/schools?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Kanyakumari School Directory",
      url: SITE_URL,
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kanyakumari School Directory",
    url: SITE_URL,
    description:
      "A comprehensive school directory helping parents find the best schools in Kanyakumari District, Tamil Nadu.",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Kanyakumari District, Tamil Nadu, India",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Kanyakumari District" />
        <meta name="geo.position" content="8.0883;77.5385" />
        <meta name="ICBM" content="8.0883, 77.5385" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
