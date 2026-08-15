import React from "react";

export function FullCard({ icon, title, subtitle, children }) {
    return (
        <div className="full-card">
            <div className="full-card-header">
                <div className="calc-card-icon">{icon}</div>
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{title}</h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{subtitle}</p>
                </div>
            </div>
            <div className="full-card-body">{children}</div>
        </div>
    );
}