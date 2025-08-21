"use client";

import { openModalUserlogin } from "@/utlis/aside";

export default function User() {
  return (
    <svg
      onClick={openModalUserlogin}
      className="d-block"
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use href="#icon_user" />
    </svg>
  );
}
