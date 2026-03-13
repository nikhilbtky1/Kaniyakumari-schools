import Link from "next/link";
import { MapPin, BookOpen, ArrowRight, Star } from "lucide-react";
import styles from "./SchoolCard.module.css";

function getBadgeClass(type) {
    switch (type) {
        case "Government": return "badge-government";
        case "Private": return "badge-private";
        case "Aided": return "badge-aided";
        default: return "";
    }
}

function getBoardBadgeClass(board) {
    switch (board) {
        case "CBSE": return "badge-cbse";
        case "ICSE": return "badge-icse";
        case "State Board": return "badge-state-board";
        case "Matriculation": return "badge-matriculation";
        default: return "";
    }
}

export default function SchoolCard({ school }) {
    return (
        <Link href={`/schools/${school.slug}`} className={styles.schoolCard}>
            <div className={styles.cardHeader}>
                <div className={styles.badges}>
                    <span className={`badge ${getBadgeClass(school.school_type)}`}>
                        {school.school_type}
                    </span>
                    <span className={`badge ${getBoardBadgeClass(school.board)}`}>
                        {school.board}
                    </span>
                </div>
                {school.rating > 0 && (
                    <div className={styles.rating}>
                        <Star size={14} fill="currentColor" className={styles.starIcon} />
                        <span>{school.rating} ({school.reviews})</span>
                    </div>
                )}
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.schoolName}>{school.school_name}</h3>
                <div className={styles.schoolMeta}>
                    <div className={styles.metaItem}>
                        <MapPin size={14} />
                        <span>{school.village}, {school.taluk}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <BookOpen size={14} />
                        <span>{school.classes_available}</span>
                    </div>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <span className={styles.classesTag}>{school.district}</span>
                <span className={styles.viewBtn}>
                    View Details <ArrowRight size={14} />
                </span>
            </div>
        </Link>
    );
}
