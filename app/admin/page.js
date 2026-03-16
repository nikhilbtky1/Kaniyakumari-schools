"use client";

import { useState, useEffect, useRef } from "react";
import {
    Shield, BarChart3, School, Clock, Upload, Plus,
    Edit, Trash2, Check, X, LogOut, Users, AlertCircle
} from "lucide-react";

const TALUKS = ["Agastheeswaram", "Kalkulam", "Killiyoor", "Thiruvattar", "Thovalai", "Vilavancode"];
const TYPES = ["Government", "Aided"];
const BOARDS = ["CBSE", "ICSE", "State Board", "Matriculation"];

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");

    function handleLogin(e) {
        e.preventDefault();
        // Simple client-side gate - pass is from env but we default to admin123
        if (password === "admin123") {
            setAuthed(true);
        } else {
            setAuthError("Incorrect password");
        }
    }

    if (!authed) {
        return (
            <>
                <div className="page-header">
                    <div className="container">
                        <h1>🔐 Admin Dashboard</h1>
                        <p>Please enter the admin password to continue</p>
                    </div>
                </div>
                <div className="container section" style={{ maxWidth: "400px" }}>
                    <div className="card">
                        <div className="card-body">
                            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                <Shield size={48} style={{ color: "var(--primary-600)", margin: "0 auto 1rem" }} />
                                <h2 style={{ fontSize: "1.25rem" }}>Admin Login</h2>
                            </div>
                            {authError && (
                                <div style={{ padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: "var(--radius-lg)", color: "var(--error)", fontSize: "0.875rem", marginBottom: "1rem", textAlign: "center" }}>
                                    {authError}
                                </div>
                            )}
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" required />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                                    <Shield size={16} /> Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return <AdminDashboard onLogout={() => setAuthed(false)} />;
}

function AdminDashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({ total: 0, pending: 0, government: 0, private: 0, aided: 0 });
    const [schools, setSchools] = useState([]);
    const [pendingSchools, setPendingSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [editingSchool, setEditingSchool] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [statsRes, schoolsRes] = await Promise.all([
                fetch("/api/stats"),
                fetch("/api/schools?limit=200"),
            ]);
            const statsData = await statsRes.json();
            const schoolsData = await schoolsRes.json();
            setStats(statsData);

            const all = schoolsData.schools || [];
            setSchools(all);
            setPendingSchools(all.filter(s => !s.approved));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    function showToast(message, type = "success") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }

    async function handleApprove(id) {
        try {
            await fetch(`/api/schools/${id}/approve`, { method: "POST" });
            showToast("School approved successfully!");
            loadData();
        } catch (e) {
            showToast("Failed to approve", "error");
        }
    }

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this school?")) return;
        try {
            await fetch(`/api/schools/${id}`, { method: "DELETE" });
            showToast("School deleted");
            loadData();
        } catch (e) {
            showToast("Failed to delete", "error");
        }
    }

    async function handleCSVUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                showToast(`Imported ${data.imported} schools`);
                loadData();
            } else {
                showToast(data.error || "Upload failed", "error");
            }
        } catch (e) {
            showToast("Upload error", "error");
        }
        e.target.value = "";
    }

    async function handleSaveEdit(formData) {
        try {
            await fetch(`/api/schools/${formData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            showToast("School updated!");
            setEditingSchool(null);
            loadData();
        } catch (e) {
            showToast("Failed to update", "error");
        }
    }

    return (
        <>
            <div className="page-header" style={{ padding: "1.5rem 0" }}>
                <div className="container">
                    <div className="dashboard-header">
                        <div>
                            <h1 style={{ fontSize: "1.5rem" }}>⚙️ Admin Dashboard</h1>
                            <p style={{ fontSize: "0.9375rem" }}>Manage schools, approve submissions, and view statistics</p>
                        </div>
                        <button className="btn btn-outline" onClick={onLogout} style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: "2rem 1.5rem" }}>
                {/* Tabs */}
                <div className="tabs">
                    {[
                        { id: "overview", label: "Overview", icon: <BarChart3 size={16} /> },
                        { id: "schools", label: "All Schools", icon: <School size={16} /> },
                        { id: "pending", label: `Pending (${pendingSchools.length})`, icon: <Clock size={16} /> },
                        { id: "import", label: "CSV Import", icon: <Upload size={16} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ display: "flex", alignItems: "center", gap: "6px" }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="spinner" />
                ) : (
                    <>
                        {/* Overview */}
                        {activeTab === "overview" && (
                            <div>
                                <div className="admin-grid" style={{ marginBottom: "2rem" }}>
                                    <div className="stat-card">
                                        <div className="stat-value">{stats.total}</div>
                                        <div className="stat-label">Total Schools</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value" style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                            {stats.pending}
                                        </div>
                                        <div className="stat-label">Pending Approval</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value" style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                            {stats.government}
                                        </div>
                                        <div className="stat-label">Government</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value" style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                            {stats.private}
                                        </div>
                                        <div className="stat-label">Private</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-value" style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                            {stats.aided}
                                        </div>
                                        <div className="stat-label">Aided</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* All Schools Table */}
                        {activeTab === "schools" && (
                            <div>
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>School Name</th>
                                                <th>Type</th>
                                                <th>Board</th>
                                                <th>Taluk</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schools.map((s) => (
                                                <tr key={s.id}>
                                                    <td style={{ fontWeight: 600, maxWidth: "250px" }}>{s.school_name}</td>
                                                    <td><span className={`badge badge-${s.school_type.toLowerCase()}`}>{s.school_type}</span></td>
                                                    <td>{s.board}</td>
                                                    <td>{s.taluk}</td>
                                                    <td>
                                                        <span className={`badge ${s.approved ? "badge-approved" : "badge-pending"}`}>
                                                            {s.approved ? "Approved" : "Pending"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="table-actions">
                                                            <button className="btn btn-sm btn-outline" onClick={() => setEditingSchool(s)} title="Edit">
                                                                <Edit size={14} />
                                                            </button>
                                                            {!s.approved && (
                                                                <button className="btn btn-sm btn-success" onClick={() => handleApprove(s.id)} title="Approve">
                                                                    <Check size={14} />
                                                                </button>
                                                            )}
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)} title="Delete">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Pending Schools */}
                        {activeTab === "pending" && (
                            <div>
                                {pendingSchools.length === 0 ? (
                                    <div className="empty-state">
                                        <CheckCircleIcon />
                                        <h3>No Pending Schools</h3>
                                        <p>All submissions have been reviewed.</p>
                                    </div>
                                ) : (
                                    <div className="table-container">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>School Name</th>
                                                    <th>Type</th>
                                                    <th>Board</th>
                                                    <th>Taluk</th>
                                                    <th>Submitted</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingSchools.map((s) => (
                                                    <tr key={s.id}>
                                                        <td style={{ fontWeight: 600 }}>{s.school_name}</td>
                                                        <td>{s.school_type}</td>
                                                        <td>{s.board}</td>
                                                        <td>{s.taluk}</td>
                                                        <td style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                                                            {new Date(s.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <div className="table-actions">
                                                                <button className="btn btn-sm btn-success" onClick={() => handleApprove(s.id)}>
                                                                    <Check size={14} /> Approve
                                                                </button>
                                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>
                                                                    <X size={14} /> Reject
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CSV Import */}
                        {activeTab === "import" && (
                            <div style={{ maxWidth: "600px" }}>
                                <div className="card">
                                    <div className="card-body">
                                        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>📄 Import Schools from CSV</h2>
                                        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
                                            Upload a CSV file with school data. Required columns: <strong>school_name, school_type, board, taluk</strong>.
                                            Optional: udise_code, address, village, district, pincode, phone, email, website, classes_available, latitude, longitude.
                                        </p>
                                        <div style={{ border: "2px dashed var(--gray-300)", borderRadius: "var(--radius-xl)", padding: "3rem", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
                                            onClick={() => fileInputRef.current?.click()}>
                                            <Upload size={40} style={{ color: "var(--gray-400)", margin: "0 auto 1rem" }} />
                                            <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Click to upload CSV file</p>
                                            <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>Supports .csv files</p>
                                        </div>
                                        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: "none" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Edit Modal */}
            {editingSchool && (
                <EditModal school={editingSchool} onClose={() => setEditingSchool(null)} onSave={handleSaveEdit} />
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>{toast.message}</div>
            )}
        </>
    );
}

function CheckCircleIcon() {
    return <Check size={48} style={{ color: "var(--success)", margin: "0 auto 1rem" }} />;
}

function EditModal({ school, onClose, onSave }) {
    const [form, setForm] = useState({ ...school });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form);
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit School</h3>
                    <button className="btn btn-icon" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                                <label className="form-label">School Name</label>
                                <input className="form-input" name="school_name" value={form.school_name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select className="form-select" name="school_type" value={form.school_type} onChange={handleChange}>
                                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Board</label>
                                <select className="form-select" name="board" value={form.board} onChange={handleChange}>
                                    {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Village</label>
                                <input className="form-input" name="village" value={form.village || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Taluk</label>
                                <select className="form-select" name="taluk" value={form.taluk} onChange={handleChange}>
                                    {TALUKS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                                <label className="form-label">Address</label>
                                <input className="form-input" name="address" value={form.address || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" name="phone" value={form.phone || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" name="email" value={form.email || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Classes</label>
                                <input className="form-input" name="classes_available" value={form.classes_available || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pincode</label>
                                <input className="form-input" name="pincode" value={form.pincode || ""} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Featured</label>
                                <select className="form-select" name="featured" value={form.featured} onChange={(e) => setForm({ ...form, featured: parseInt(e.target.value) })}>
                                    <option value={0}>No</option>
                                    <option value={1}>Yes</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Approved</label>
                                <select className="form-select" name="approved" value={form.approved} onChange={(e) => setForm({ ...form, approved: parseInt(e.target.value) })}>
                                    <option value={0}>Pending</option>
                                    <option value={1}>Approved</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
