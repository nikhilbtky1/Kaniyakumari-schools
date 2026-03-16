"use client";

import { useState } from "react";
import { Send, CheckCircle, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
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
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setSuccess(true);
                setForm({ name: "", email: "", message: "" });
            } else {
                const data = await res.json();
                setError(data.error || "Failed to send message");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }
        setSubmitting(false);
    }

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb">
                        <a href="/">Home</a><span>/</span>
                        <span className="current">Contact</span>
                    </div>
                    <h1>📬 Contact Us</h1>
                    <p>Have questions or feedback? We'd love to hear from you.</p>
                </div>
            </div>

            <div className="container section">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: "960px", margin: "0 auto" }}>
                    {/* Contact Form */}
                    <div className="card">
                        <div className="card-body">
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Send us a Message</h2>

                            {success ? (
                                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                                    <CheckCircle size={48} style={{ color: "var(--success)", margin: "0 auto 1rem" }} />
                                    <h3>Message Sent!</h3>
                                    <p style={{ color: "var(--text-secondary)", margin: "0.5rem 0 1.5rem" }}>
                                        We'll get back to you as soon as possible.
                                    </p>
                                    <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {error && (
                                        <div style={{ padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-lg)", color: "var(--error)", marginBottom: "1rem", fontSize: "0.875rem" }}>
                                            {error}
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label">Name *</label>
                                        <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Message *</label>
                                        <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} required placeholder="How can we help?" rows={5} />
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
                                        <Send size={16} />
                                        {submitting ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <div className="card" style={{ marginBottom: "1.5rem" }}>
                            <div className="card-body">
                                <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Contact Information</h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                        <div style={{ width: "40px", height: "40px", background: "var(--primary-50)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Mail size={18} style={{ color: "var(--primary-600)" }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Email</div>
                                            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>info@kanyakumarischools.in</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                        <div style={{ width: "40px", height: "40px", background: "var(--primary-50)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <MapPin size={18} style={{ color: "var(--primary-600)" }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Address</div>
                                            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Kanyakumari District, Tamil Nadu, India</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
