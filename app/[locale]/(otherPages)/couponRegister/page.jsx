"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as XLSX from 'xlsx'; // Make sure to install: npm install xlsx

export default function CouponManager() {
    const [file, setFile] = useState(null);
    const [couponId, setCouponId] = useState(''); 
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const params = useParams();
    const router = useRouter();
    const locale = params.locale;

    const handleLogout = () => {
        document.cookie = "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        router.push(`/${locale}/admin/login`);
    };

    const handleUpload = async () => {
        if (!file || !couponId) return alert("Please select a file and enter a Coupon ID");

        setLoading(true);
        setResult(null);
        setProgress({ current: 0, total: 0 });

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                
                const dataRows = rows.slice(1); // Skip Header
                setProgress({ current: 0, total: dataRows.length });

                let successCount = 0;
                let failureList = [];

                // CLIENT-SIDE LOOP: Send one by one
                for (let i = 0; i < dataRows.length; i++) {
                    const row = dataRows[i];
                    const name = String(row[0] || "Customer").trim();
                    const email = String(row[1] || "").trim();
                    let phone = String(row[2] || "").replace(/[^0-9]/g, '');

                    if (!phone) continue;
                    if (phone.length === 9 || (phone.length === 10 && !phone.startsWith('0'))) {
                        phone = '0' + phone;
                    }

                    try {
                        const response = await fetch(`/${locale}/api/bulk-register`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ couponId, name, email, phone }),
                        });

                        const resData = await response.json();

                        if (response.ok) {
                            successCount++;
                        } else {
                            failureList.push({ phone, email, error: resData.error || "Rejected" });
                        }
                    } catch (err) {
                        failureList.push({ phone, email, error: "Network Error" });
                    }

                    // Update Progress Bar
                    setProgress(prev => ({ ...prev, current: i + 1 }));
                }

                setResult({
                    summary: { total_success: successCount, total_failed: failureList.length },
                    failures: failureList
                });

            } catch (err) {
                console.error("File Read Error:", err);
                alert("Error reading file. Please ensure it's a valid Excel or CSV.");
            } finally {
                setLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        {/* Header: Dark Background with White Text and Logout */}
                        <div className="card-header bg-dark d-flex justify-content-between align-items-center py-3">
                            <h5 className="mb-0 text-white fw-bold">Batch Coupon Registration</h5>
                            <button className="btn btn-sm btn-outline-light px-3" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>

                        <div className="card-body p-4">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Coupon ID</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={couponId}
                                    onChange={(e) => setCouponId(e.target.value)}
                                />
                                <div className="form-text">Paste the UUID or ID provided for the coupon.</div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Select File (Excel or CSV)</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    accept=".csv, .xlsx, .xls"
                                    onChange={(e) => setFile(e.target.files[0])} 
                                />
                                <div className="form-text">Columns: Name (A), Email (B), Phone (C).</div>
                            </div>

                            <button 
                                className="btn btn-primary btn-lg w-100" 
                                onClick={handleUpload}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : 'Start Registration'}
                            </button>

                            {/* Progress Bar Section */}
                            {loading && (
                                <div className="mt-4">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-dark small fw-bold">Processing: {progress.current} / {progress.total}</span>
                                        <span className="text-dark small fw-bold">{Math.round((progress.current / progress.total) * 100)}%</span>
                                    </div>
                                    <div className="progress" style={{ height: '10px' }}>
                                        <div 
                                            className="progress-bar progress-bar-striped progress-bar-animated" 
                                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {result && !loading && (
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
                                                                <td className="text-dark">{fail.phone}</td>
                                                                <td className="text-dark">{fail.email}</td>
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