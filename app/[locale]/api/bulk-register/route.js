import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const couponId = formData.get('couponId');

        if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

        const buffer = await file.arrayBuffer();
        let rows = [];

        // 1. Parse File
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
        } else {
            const fileText = new TextDecoder().decode(buffer);
            rows = Papa.parse(fileText, { header: false, skipEmptyLines: true }).data;
        }

        const dataRows = rows.slice(1);
        let successCount = 0;
        let failures = [];

        for (const row of dataRows) {
            const name = String(row[0] || "Customer").trim();
            const email = String(row[1] || "").trim();
            let phone = String(row[2] || "").replace(/[^0-9]/g, '');

            if (!phone) continue;

            // Fix leading zero
            if (phone.length === 9 || (phone.length === 10 && !phone.startsWith('0'))) {
                phone = '0' + phone;
            }

            try {
                const baseUrl = process.env.NEXT_PUBLIC_SMARTVIEW_API_URL;
                const fullUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}Coupon/Register`;

                const apiRes = await fetch(fullUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        couponId: couponId,
                        customerName: name,
                        email: email || `user_${phone}@example.com`,
                        mobileNo: phone,
                    }),
                });

                // Get the raw text first to avoid JSON parsing errors
                const responseText = await apiRes.text();
                let responseData;
                
                try {
                    responseData = JSON.parse(responseText);
                } catch (e) {
                    responseData = { message: responseText };
                }

                if (apiRes.ok) {
                    successCount++;
                } else {
                    const cleanMessage = responseData?.response?.message || responseData?.message || "API Rejected Request";
                    // This captures "Already Registered", "Invalid Coupon", etc.
                    failures.push({ 
                        phone, 
                        email, 
                        error: cleanMessage
                    });
                }

                await delay(150); // Small delay to prevent rate limits

            } catch (err) {
                failures.push({ phone, email, error: "Connection Error: API unreachable" });
            }
        }

        return NextResponse.json({
            summary: { 
                total_success: successCount, 
                total_failed: failures.length 
            },
            failures
        });

    } catch (error) {
        return NextResponse.json({ message: "Critical Server Error" }, { status: 500 });
    }
}