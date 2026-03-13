"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

const TALUKS = ["Agastheeswaram", "Kalkulam", "Killiyoor", "Thiruvattar", "Thovalai", "Vilavancode"];
const TYPES = ["Government", "Aided"];
const BOARDS = ["CBSE", "ICSE", "State Board", "Matriculation"];

export default function AddSchoolPage() {
    const [form, setForm] = useState({
        school_name: "", school_type: "", board: "", udise_code: "",
        address: "", village: "", taluk: "", district: "Kanyakumari",
        pincode: "", phone: "", email: "", website: "", classes_available: "",
        latitude: "", longitude: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/schools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    latitude: form.latitude ? parseFloat(form.latitude) : null,
                    longitude: form.longitude ? parseFloat(form.longitude) : null,
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setForm({
                    school_name: "", school_type: "", board: "", udise_code: "",
                    address: "", village: "", taluk: "", district: "Kanyakumari",
                    pincode: "", phone: "", email: "", website: "", classes_available: "",
                    latitude: "", longitude: "",
                });
            } else {
                const data = await res.json();
                setError(data.error || "Failed to submit");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }
        setSubmitting(false);
    }

    if (success) {
        return (
            <>
                <div className="page-header">
                    <div className="container">
                        <h1>✅ School Submitted!</h1>
                    </div>
                </div>
                <div className="container section" style={{ textAlign: "center", maxWidth: "600px" }}>
                    <CheckCircle size={64} style={{ color: "var(--success)", margin: "0 auto 1.5rem" }} />
                    <h2>Thank You!</h2>
                    <p style={{ color: "var(--text-secondary)", margin: "1rem 0 2rem", lineHeight: 1.7 }}>
                        Your school has been submitted for review. Once approved by our admin team, it will appear in the directory.
                    </p>
                    <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                        Submit Another School
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <span className="current">Add School</span>
                    </div>
                    <h1>➕ Add a School</h1>
                    <p>Submit a school to be listed in the Kanyakumari School Directory</p>
                </div>
            </div>

            <div className="container-narrow section">
                <div className="card">
                    <div className="card-body">
                        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", padding: "1rem", background: "var(--primary-50)", borderRadius: "var(--radius-lg)", borderLeft: "4px solid var(--primary-500)" }}>
                            📝 All submissions require admin approval before being published. Please provide accurate information.
                        </p>

                        {error && (
                            <div style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-lg)", color: "var(--error)", marginBottom: "1.5rem" }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div className="form-group" style={{ gridColumn: "span 2" }}>
                                    <label className="form-label">School Name *</label>
                                    <input className="form-input" name="school_name" value={form.school_name} onChange={handleChange} required placeholder="Enter school name" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">School Type *</label>
                                    <select className="form-select" name="school_type" value={form.school_type} onChange={handleChange} required>
                                        <option value="">Select type</option>
                                        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Board / Curriculum *</label>
                                    <select className="form-select" name="board" value={form.board} onChange={handleChange} required>
                                        <option value="">Select board</option>
                                        {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">UDISE Code</label>
                                    <input className="form-input" name="udise_code" value={form.udise_code} onChange={handleChange} placeholder="UDISE code (optional)" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Classes Available</label>
                                    <input className="form-input" name="classes_available" value={form.classes_available} onChange={handleChange} placeholder="e.g., LKG to XII" />
                                </div>

                                <div className="form-group" style={{ gridColumn: "span 2" }}>
                                    <label className="form-label">Address</label>
                                    <input className="form-input" name="address" value={form.address} onChange={handleChange} placeholder="Street address" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Village</label>
                                    <input className="form-input" name="village" value={form.village} onChange={handleChange} placeholder="Village name" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Taluk *</label>
                                    <select className="form-select" name="taluk" value={form.taluk} onChange={handleChange} required>
                                        <option value="">Select taluk</option>
                                        {TALUKS.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">District</label>
                                    <input className="form-input" name="district" value={form.district} onChange={handleChange} placeholder="Kanyakumari" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Pincode</label>
                                    <input className="form-input" name="pincode" value={form.pincode} onChange={handleChange} placeholder="629001" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="school@example.com" />
                                </div>

                                <div className="form-group" style={{ gridColumn: "span 2" }}>
                                    <label className="form-label">Website</label>
                                    <input className="form-input" name="website" value={form.website} onChange={handleChange} placeholder="https://www.school.edu.in" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Latitude</label>
                                    <input className="form-input" name="latitude" value={form.latitude} onChange={handleChange} placeholder="e.g., 8.1833" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Longitude</label>
                                    <input className="form-input" name="longitude" value={form.longitude} onChange={handleChange} placeholder="e.g., 77.4119" />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "1rem" }} disabled={submitting}>
                                <Send size={18} />
                                {submitting ? "Submitting..." : "Submit School for Review"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
