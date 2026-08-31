"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useUser } from "../../context/UserContext";
import { useMenu } from "../../context/MenuContext";
import UserLoggedIn from "../headers/components/UserLoggedIn";
import User from "../headers/components/User";
import { BsTruck } from "react-icons/bs";

export default function MobileFooter1() {
    const locale = useLocale();
    const [showFooter, setShowFooter] = useState(false);
    const { isLoggedIn } = useUser();
    const { homeSliders } = useMenu();

    useEffect(() => {
        setShowFooter(true);
    }, []);

    const isSaleLink = (link) => {
        if (!link) return false;
        const s = String(link).toLowerCase();
        return s === "sale" || s === "/sale" || s.includes("/sale");
    };

    const saleDesktop = Array.isArray(homeSliders)
        ? homeSliders.find((s) => isSaleLink(s.link))
        : null;

    const saleBanner = saleDesktop;

    return (
        <footer
            className={`footer-mobile container w-100 px-2 d-md-none bg-body ${
                showFooter ? "position-fixed footer-mobile_initialized" : ""
            }`}
        >
            <div className="row flex-nowrap text-center align-items-center g-0">
                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                    <Link
                        href={`/${locale}`}
                        className="footer-mobile__link d-flex flex-column align-items-center text-nowrap"
                    >
                        <svg
                            className="d-block"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <use href="#icon_home" />
                        </svg>
                        <span>Home</span>
                    </Link>
                </div>

                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                    <Link
                        href={`/${locale}/shop`}
                        className="footer-mobile__link d-flex flex-column align-items-center text-nowrap"
                    >
                        <svg
                            className="d-block"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <use href="#icon_gift" />
                        </svg>
                        <span>Shop</span>
                    </Link>
                </div>

                {saleBanner && (
                    <div className="col" style={{ flex: 1, minWidth: 0 }}>
                        <Link
                            href={`/${locale}/sale`}
                            className="footer-mobile__link d-flex flex-column align-items-center text-nowrap"
                            style={{ marginTop: "-22px" }}
                        >
                            <div
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    position: "relative",
                                    border: "2px solid #ffffff",
                                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                                }}
                            >
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}storage/${saleBanner.mobile_image || saleBanner.image}`}
                                    alt={saleBanner.title || "Sale"}
                                    fill
                                    style={{
                                        objectFit: "cover",
                                        transform: "scale(1.15)",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "50%",
                                        background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.25) 100%)",
                                        pointerEvents: "none",
                                    }}
                                />
                            </div>
                        </Link>
                    </div>
                )}

                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                    {!isLoggedIn ? (
                        <Link
                            className="footer-mobile__link d-flex flex-column align-items-center text-nowrap"
                            href={`/${locale}/login_register`}
                        >
                            <User />
                            <span>LogIn</span>
                        </Link>
                    ) : (
                        <Link
                            href={`/${locale}/account_dashboard`}
                            className="footer-mobile__link d-flex flex-column align-items-center text-nowrap"
                        >
                            <UserLoggedIn />
                            <span>Account</span>
                        </Link>
                    )}
                </div>

                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                    <Link
                        href={`/${locale}/order-tracking`}
                        className="footer-mobile__link d-flex flex-column align-items-center text-nowrap"
                    >
                        <BsTruck size={18} className="d-block" />
                        <span>Tracking</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
