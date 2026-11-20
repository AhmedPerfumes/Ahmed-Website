import { headers } from "next/headers";
import VisitorInit from "@/components/common/VisitorInit";
// import CursorFollower from "@/components/common/CursorFollower";

export default async function RootLayout({ children }) {
  const headersList = headers();

  const pathname = headersList.get("x-pathname") || "";

  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <VisitorInit />
        {/* <CursorFollower /> */}
        {children}
      </body>
    </html>
  );
}