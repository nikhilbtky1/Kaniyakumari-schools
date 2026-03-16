"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import styles from "./Header.module.css";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/schools", label: "Schools" },
    { href: "/taluk", label: "Taluk-wise" },
    { href: "/curriculum", label: "Curriculum" },
    { href: "/map", label: "Map" },
    { href: "/add-school", label: "Add School" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <GraduationCap size={22} />
                        </div>
                        <div className={styles.logoText}>
                            Kanyakumari<br /><span>School Directory</span>
                        </div>
                    </Link>

                    <nav className={styles.nav}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ""}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={styles.mobileNavLink}
                        onClick={() => setMobileOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </>
    );
}
