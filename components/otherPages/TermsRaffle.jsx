import { useTranslations } from "next-intl";
import React from "react";

export default function TermsRaffle() {
    const t = useTranslations();
    return (
        <>
            <section
                className="container mw-930 lh-30 p-4"
                style={{ fontFamily: "'Lato-Regular', sans-serif" }}
            >

                <h2 style={{ fontSize: "36px" }}>
                    Celebrate 25 years of Passion – Ahmed Al Maghribi Perfumes
                </h2>

                <h3 className="p-4" style={{ fontSize: "26px" }}>
                    Terms &amp; Conditions – Shop &amp; Win
                </h3>

                <h4>1. Eligibility and Purchase Requirements</h4>
                <p>These rules determine who can enter and what purchases qualify.</p>

                {/* =========================
                    TABLE WITH INLINE STYLES
                ============================= */}
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px",
                        marginBottom: "20px",
                        fontSize: "20px",
                        scrollBehavior: "smooth"
                    }}
                >
                    <thead>
                        <tr>
                            {["Category", "Detailed Condition", "Typical Exclusion"].map((title, i) => (
                                <th
                                    key={i}
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "10px",
                                        background: "#f7f7f7",
                                        fontWeight: "600",
                                        textAlign: "left"
                                    }}
                                >
                                    {title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Minimum Spend
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                The qualifying amount is a single or cumulative total of AED 250 spent in participating outlets during the promotion period.
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Cumulative receipts completely not valid. All receipts must be from the same day and/or the same customer.
                            </td>
                        </tr>

                        <tr>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Eligible Purchases
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Valid transactions from designated stores or online at www.ahmedalmaghribi.com
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Non-participating outlets
                            </td>
                        </tr>

                        <tr>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Eligible Gift With Purchase
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                {/* ANCHOR LINK — SCROLLS TO PRODUCT LIST */}
                                <a href="#gwp-list" style={{ color: "#0070f3", textDecoration: "underline" }}>
                                    GWP Product List
                                </a>
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Choice of selection
                            </td>
                        </tr>

                        <tr>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Receipt Validity
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Only original, printed receipts are eligible. Online purchases receive an email for each raffle entry.
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Tampered, illegible, or return/exchange receipts.
                            </td>
                        </tr>

                        <tr>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Eligibility of Person
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Entrants must be individuals (not companies), at least 18 years old, and hold valid Emirates ID, resident visa, or passport.
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                Employees of promoter/mall, immediate family members, and suppliers.
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h4>2. Raffle/Draw Entry Process (Shop &amp; Win)</h4>

                <ul>
                    <li><strong>Redemption Location:</strong> Present original receipts at the Customer Service Desk or Promotion Kiosk.</li>
                    <li><strong>Registration Process:</strong> Provide Full Name, Mobile Number, and Invoice Number as per DED regulations.</li>
                    <li><strong>Entry Mechanism:</strong> One raffle entry for every AED 250 spent.</li>
                    <li><strong>Draw Supervision:</strong> Conducted under supervision of Dubai DED or relevant authority.</li>
                </ul>

                <h4>3. Gift with Purchase (GWP) Terms</h4>

                <ul>
                    <li><strong>Availability:</strong> First-come, first-served while stock lasts.</li>
                    <li><strong>Limit:</strong> One GWP per customer per day.</li>
                    <li><strong>Value:</strong> No cash value. Non-transferable and non-exchangeable.</li>
                    <li><strong>Return Policy Clause:</strong> If the qualifying purchase is refunded, the GWP must be returned unused.</li>
                    <li><strong>Condition of GWP:</strong> Provided “as is.” No liability for defects after redemption.</li>
                </ul>

                <h4>4. Prize Claim and General Conditions</h4>

                <ul>
                    <li><strong>Winner Notification:</strong> Via phone or email.</li>
                    <li><strong>Claim Period:</strong> Must claim within 15 days.</li>
                    <li><strong>Forfeiture:</strong> Unclaimed prizes are forfeited.</li>
                    <li><strong>Publicity Consent:</strong> Winner agrees name & photo may be used in promotions.</li>
                </ul>

                {/* ================================
    ANCHORED GWP PRODUCT LIST SECTION
================================= */}
<h3 id="gwp-list" style={{ marginTop: "60px", fontSize: "28px" }}>
    GWP Product List
</h3>

<div
    style={{
        display: "flex",
        gap: "40px",
        marginTop: "20px",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap"
    }}
>

    {/* LEFT COLUMN — BODY GEL */}
    <div style={{ flex: "1", minWidth: "300px" }}>
        <h4 style={{ marginBottom: "10px" }}>Body Gel</h4>

        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "40px"
            }}
        >
            <thead>
                <tr>
                    <th
                        style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            background: "#f7f7f7",
                            textAlign: "left"
                        }}
                    >
                        Product
                    </th>
                </tr>
            </thead>

            <tbody>
                {[
                    "BIDUN ESAM BODY GEL 30ML",
                    "OUD & ROSES GEL 30MLE",
                    "HIRFAH GEL 30ML",
                    "SUPREME GEL 20ML",
                    "OUD & ROSES GEL 20MLE",
                    "MUZN GEL 30ML",
                    "LITTLE HEARTS GEL 30ML (New)",
                    "MARJ GEL 30ML",
                    "SUPREME GEL 30ML (New)",
                    "OUD & ROSES GEL 30ML (New)",
                    "HIRFAH GEL 30ML (New)",
                    "BIDUN ESAM GEL 30ML (New)"
                ].map((name, index) => (
                    <tr key={index}>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                            {name}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    {/* RIGHT COLUMN — AIR FRESHENER */}
    <div style={{ flex: "1", minWidth: "300px" }}>
        <h4 style={{ marginBottom: "10px" }}>Air Freshener</h4>

        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "40px"
            }}
        >
            <thead>
                <tr>
                    <th
                        style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            background: "#f7f7f7",
                            textAlign: "left"
                        }}
                    >
                        Product
                    </th>
                </tr>
            </thead>

            <tbody>
                {[
                    "LILFRASH BIDUN ESAM 300ML",
                    "LILFRASH SUPREME 300ML",
                    "LILFRASH LITTLE HEARTS 300ML",
                    "LILFRASH DARI 300ML",
                    "LILFRASH TAMAM 300ML",
                    "LILFRASH JAW 300ML",
                    "LILFRASH OUD LAVENDER 300ML",
                    "LILFRASH OUD & ROSES 300ML",
                    "LILFRASH RASHHAT 300ML",
                    "LILFRASH KENAYAH 300ML",
                    "LILFRASH GHURFAT 300ML",
                    "LILFRASH GHAMIR 300ML",
                    "LILFRASH OUD & ROSES 300ML W/BOX"
                ].map((name, index) => (
                    <tr key={index}>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                            {name}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

</div>


            </section>
        </>
    );
}
