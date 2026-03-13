"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import SchoolCard from "@/components/SchoolCard";
import styles from "./schools.module.css";

const TALUKS = ["Agastheeswaram", "Kalkulam", "Killiyoor", "Thiruvattar", "Thovalai", "Vilavancode"];
const TYPES = ["Government", "Aided"];
const BOARDS = ["CBSE", "ICSE", "State Board", "Matriculation"];
const SORTS = [
    { value: "name_asc", label: "Name (A-Z)" },
    { value: "name_desc", label: "Name (Z-A)" },
    { value: "recent", label: "Recently Added" },
    { value: "oldest", label: "Oldest First" },
];

export default function SchoolsPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: "4rem 2rem", textAlign: "center" }}><div className="spinner" /></div>}>
            <SchoolsContent />
        </Suspense>
    );
}

function SchoolsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [schools, setSchools] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentPage = parseInt(searchParams.get("page") || "1");
    const currentSort = searchParams.get("sort") || "name_asc";
    const currentSearch = searchParams.get("search") || "";
    const currentTaluk = searchParams.get("taluk") || "";
    const currentType = searchParams.get("school_type") || "";
    const currentBoard = searchParams.get("board") || "";

    useEffect(() => {
        fetchSchools();
    }, [searchParams]);

    async function fetchSchools() {
        setLoading(true);
        const params = new URLSearchParams({
            page: currentPage.toString(),
            sort: currentSort,
            search: currentSearch,
            taluk: currentTaluk,
            school_type: currentType,
            board: currentBoard,
        });

        try {
            const res = await fetch(`/api/schools?${params}`);
            const data = await res.json();
            setSchools(data.schools || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    function updateFilter(key, value) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`/schools?${params.toString()}`);
    }

    function goToPage(page) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/schools?${params.toString()}`);
    }

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a>
                        <span>/</span>
                        <span className="current">All Schools</span>
                    </div>
                    <h1>All Schools in Kanyakumari District</h1>
                    <p>Browse and filter {total} schools across 4 taluks</p>
                </div>
            </div>

            <div className={styles.pageWrapper}>
                {/* Mobile filter button */}
                <button
                    className={`btn btn-outline ${styles.mobileFilterBtn}`}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <SlidersHorizontal size={16} /> Filters
                </button>

                {/* Filter Sidebar */}
                <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
                    <div className={styles.sidebarTitle}>
                        <Filter size={18} /> Filters
                    </div>

                    {/* Search within */}
                    <div className="filter-section">
                        <h4>Search</h4>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search schools..."
                            value={currentSearch}
                            onChange={(e) => updateFilter("search", e.target.value)}
                        />
                    </div>

                    {/* Taluk Filter */}
                    <div className="filter-section">
                        <h4>Taluk</h4>
                        <label className="filter-option">
                            <input
                                type="radio"
                                name="taluk"
                                checked={currentTaluk === ""}
                                onChange={() => updateFilter("taluk", "")}
                            />
                            All Taluks
                        </label>
                        {TALUKS.map((t) => (
                            <label key={t} className="filter-option">
                                <input
                                    type="radio"
                                    name="taluk"
                                    checked={currentTaluk === t}
                                    onChange={() => updateFilter("taluk", t)}
                                />
                                {t}
                            </label>
                        ))}
                    </div>

                    {/* School Type Filter */}
                    <div className="filter-section">
                        <h4>School Type</h4>
                        <label className="filter-option">
                            <input
                                type="radio"
                                name="type"
                                checked={currentType === ""}
                                onChange={() => updateFilter("school_type", "")}
                            />
                            All Types
                        </label>
                        {TYPES.map((t) => (
                            <label key={t} className="filter-option">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={currentType === t}
                                    onChange={() => updateFilter("school_type", t)}
                                />
                                {t}
                            </label>
                        ))}
                    </div>

                    {/* Board Filter */}
                    <div className="filter-section">
                        <h4>Board / Curriculum</h4>
                        <label className="filter-option">
                            <input
                                type="radio"
                                name="board"
                                checked={currentBoard === ""}
                                onChange={() => updateFilter("board", "")}
                            />
                            All Boards
                        </label>
                        {BOARDS.map((b) => (
                            <label key={b} className="filter-option">
                                <input
                                    type="radio"
                                    name="board"
                                    checked={currentBoard === b}
                                    onChange={() => updateFilter("board", b)}
                                />
                                {b}
                            </label>
                        ))}
                    </div>

                    {/* Clear All */}
                    <button
                        className="btn btn-outline"
                        style={{ width: "100%", marginTop: "var(--space-4)" }}
                        onClick={() => router.push("/schools")}
                    >
                        Clear All Filters
                    </button>
                </aside>

                {/* Main Content */}
                <div className={styles.mainContent}>
                    <div className={styles.toolbar}>
                        <div className={styles.resultCount}>
                            Showing <strong>{schools.length}</strong> of <strong>{total}</strong> schools
                        </div>
                        <select
                            className={styles.sortSelect}
                            value={currentSort}
                            onChange={(e) => updateFilter("sort", e.target.value)}
                        >
                            {SORTS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="spinner" />
                    ) : schools.length === 0 ? (
                        <div className="empty-state">
                            <Search size={48} />
                            <h3>No schools found</h3>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        <div className={styles.schoolGrid}>
                            {schools.map((school) => (
                                <SchoolCard key={school.id} school={school} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={currentPage <= 1}
                                onClick={() => goToPage(currentPage - 1)}
                            >
                                ← Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    className={`pagination-btn ${p === currentPage ? "active" : ""}`}
                                    onClick={() => goToPage(p)}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                className="pagination-btn"
                                disabled={currentPage >= totalPages}
                                onClick={() => goToPage(currentPage + 1)}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
