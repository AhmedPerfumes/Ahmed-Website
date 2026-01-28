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

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8"> {/* Made slightly wider for the table */}
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-dark text-white py-3">
                            <h5 className="mb-0">Batch Coupon Registration</h5>
                        </div>
                        <div className="card-body p-4">
                            
                            {/* Coupon ID Input */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Coupon ID</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="e.g. 663854d3-1abe-460c-a10d-f81c706d5433"
                                    value={couponId}
                                    onChange={(e) => setCouponId(e.target.value)}
                                />
                                <div className="form-text">Paste the UUID or ID provided for the coupon.</div>
                            </div>

                            {/* File Input - Now accepts Excel and CSV */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Select File (Excel or CSV)</label>
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
                                <div className="mt-4">
                                    <div className="p-3 border rounded bg-light mb-3">
                                        <h6 className="fw-bold border-bottom pb-2">Batch Summary</h6>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <p className="text-black mb-1">✅ Success: <strong>{result.summary?.total_success || 0}</strong></p>
                                            </div>
                                            <div className="col-sm-6">
                                                <p className="text-danger mb-1">❌ Failed: <strong>{result.summary?.total_failed || 0}</strong></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Failure Table */}
                                    {result.failures?.length > 0 && (
                                        <div className="mt-4">
                                            <h6 className="text-danger fw-bold">Failure Details</h6>
                                            <div className="table-responsive border rounded" style={{maxHeight: '300px'}}>
                                                <table className="table table-sm table-hover mb-0">
                                                    <thead className="table-light sticky-top">
                                                        <tr>
                                                            <th>Phone</th>
                                                            <th>Email</th>
                                                            <th>Reason</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {result.failures.map((fail, index) => (
                                                            <tr key={index}>
                                                                <td>{fail.phone}</td>
                                                                <td>{fail.email}</td>
                                                                <td className="text-danger small">{fail.error}</td>
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