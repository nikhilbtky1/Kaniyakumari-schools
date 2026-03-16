import Link from "next/link";
import { GraduationCap } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <h2>🎓 Kanyakumari School Directory</h2>
                        <p>
                            Helping parents and students find the right school in Kanyakumari District, Tamil Nadu.
                            Explore government, private, and aided schools across all taluks.
                        </p>
                    </div>

                    <div className={styles.footerSection}>
                        <h3>Quick Links</h3>
                        <Link href="/schools" className={styles.footerLink}>All Schools</Link>
                        <Link href="/map" className={styles.footerLink}>Map View</Link>
                        <Link href="/add-school" className={styles.footerLink}>Add School</Link>
                        <Link href="/about" className={styles.footerLink}>About Us</Link>
                        <Link href="/contact" className={styles.footerLink}>Contact</Link>
                    </div>

                    <div className={styles.footerSection}>
                        <h3>By Taluk</h3>
                        <Link href="/taluk/Agastheeswaram" className={styles.footerLink}>Agastheeswaram</Link>
                        <Link href="/taluk/Kalkulam" className={styles.footerLink}>Kalkulam</Link>
                        <Link href="/taluk/Killiyoor" className={styles.footerLink}>Killiyoor</Link>
                        <Link href="/taluk/Thiruvattar" className={styles.footerLink}>Thiruvattar</Link>
                        <Link href="/taluk/Thovalai" className={styles.footerLink}>Thovalai</Link>
                        <Link href="/taluk/Vilavancode" className={styles.footerLink}>Vilavancode</Link>
                    </div>

                    <div className={styles.footerSection}>
                        <h3>By Curriculum</h3>
                        <Link href="/curriculum/CBSE" className={styles.footerLink}>CBSE</Link>
                        <Link href="/curriculum/ICSE" className={styles.footerLink}>ICSE</Link>
                        <Link href="/curriculum/State Board" className={styles.footerLink}>State Board</Link>
                        <Link href="/curriculum/Matriculation" className={styles.footerLink}>Matriculation</Link>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© {new Date().getFullYear()} Kanyakumari School Directory. All rights reserved.</p>
                    <p>Made with ❤️ for Kanyakumari District</p>
                </div>
            </div>
        </footer>
    );
}
