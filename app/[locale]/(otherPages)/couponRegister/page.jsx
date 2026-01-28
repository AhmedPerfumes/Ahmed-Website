"use client";
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function CouponManager() {
    const [file, setFile] = useState(null);
    const [couponId, setCouponId] = useState(''); 
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const locale = params.locale;

    const handleUpload = async () => {
        if (!file || !couponId) return alert("Please select a file and enter a Coupon ID");

        setLoading(true);
        setResult(null); // Clear previous results

        const formData = new FormData();
        formData.append('file', file);
        formData.append('couponId', couponId);

        try {
            // Point to the internal Next.js API route
            const response = await fetch(`/${locale}/api/bulk-register`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            
            if (!response.ok) {
                alert(data.message || "Server Error");
            } else {
                setResult(data);
            }
        } catch (error) {
            console.error("Internal API Error:", error);
            alert("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };
     const handleLogout = () => {
    // Expire the cookie immediately
    document.cookie = "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/couponLogin";
};

   return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        {/* Header with White Text and Logout Button */}
                        <div className="card-header bg-dark d-flex justify-content-between align-items-center py-3">
                            <h5 className="mb-0 text-white fw-bold">Batch Coupon Registration</h5>
                            <button 
                                className="btn btn-sm btn-outline-light px-3" 
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-1"></i> Logout
                            </button>
                        </div>

                        <div className="card-body p-4">
                            {/* Coupon ID Input */}
                            <div className="mb-3">
                                <label className="form-label fw-bold text-dark">Coupon ID</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={couponId}
                                    onChange={(e) => setCouponId(e.target.value)}
                                />
                                <div className="form-text">Paste the UUID or ID provided for the coupon.</div>
                            </div>

                            {/* File Input */}
                            <div className="mb-4">
                                <label className="form-label fw-bold text-dark">Select File (Excel or CSV)</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    accept=".csv, .xlsx, .xls"
                                    onChange={(e) => setFile(e.target.files[0])} 
                                />
                                <div className="form-text">Columns must be: Name (A), Email (B), Phone (C).</div>
                            </div>

                            <button 
                                className="btn btn-primary btn-lg w-100" 
                                onClick={handleUpload}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Processing Batch...</>
                                ) : 'Start Registration'}
                            </button>

                            {/* Result Summary & Failure Table */}
                            {result && (
                                <div className="mt-4 animate__animated animate__fadeIn">
                                    <div className="p-3 border rounded bg-light mb-3">
                                        <h6 className="fw-bold border-bottom pb-2 text-dark">Batch Summary</h6>
                                        <div className="row text-center">
                                            <div className="col-6 border-end">
                                                <p className="mb-0 text-muted small">SUCCESS</p>
                                                <h4 className="fw-bold text-dark mb-0">{result.summary?.total_success || 0}</h4>
                                            </div>
                                            <div className="col-6">
                                                <p className="mb-0 text-muted small">FAILED</p>
                                                <h4 className="fw-bold text-danger mb-0">{result.summary?.total_failed || 0}</h4>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Failure Table */}
                                    {result.failures?.length > 0 && (
                                        <div className="mt-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6 className="text-danger fw-bold mb-0">Failure Details</h6>
                                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                                                    {result.failures.length} Issues Found
                                                </span>
                                            </div>
                                            <div className="table-responsive border rounded" style={{maxHeight: '300px'}}>
                                                <table className="table table-sm table-hover mb-0">
                                                    <thead className="table-light sticky-top">
                                                        <tr>
                                                            <th className="py-2">Phone</th>
                                                            <th className="py-2">Email</th>
                                                            <th className="py-2">Reason</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {result.failures.map((fail, index) => (
                                                            <tr key={index}>
                                                                <td className="text-dark font-monospace">{fail.phone}</td>
                                                                <td className="text-muted">{fail.email || 'N/A'}</td>
                                                                <td className="text-danger small align-middle">{fail.error}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}