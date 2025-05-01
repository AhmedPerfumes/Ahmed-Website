import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};

// import { NextRequest, NextResponse } from 'next/server';
// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// // Initialize next-intl middleware
// const intlMiddleware = createMiddleware(routing);

// export async function middleware(request) {
//   const { pathname, origin, hostname } = request.nextUrl;
//   console.log('Middleware triggered for URL:', request.url);

//   // Skip middleware for API routes, including /<locale>/api/*
//   if (pathname.startsWith('/api') || pathname.match(/^\/(en|ar)\/api/)) {
//     console.log('Skipping middleware for API route:', pathname);
//     return NextResponse.next();
//   }

//   const userLocale = request.cookies.get('NEXT_LOCALE')?.value;
//   console.log('Current origin:', origin, 'Hostname:', hostname, 'Pathname:', pathname, 'User locale:', userLocale);

//   // Perform GeoIP lookup via API route
//   try {
//     // Get client IP
//     const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.ip || '217.165.35.39';
//     // const ip = '62.215.0.0'; // KW
//     // const ip = '92.97.63.173'; // UAE
//     // const ip = '159.0.14.172'; // KSA
//     // const ip = '37.210.202.22'; // QA
//     // const ip = '37.41.136.118'; // OM
//     // const ip = '88.201.99.52'; // BH
//     console.log('Client IP:', ip);

//     // Fetch GeoIP data from API route (use fixed 'en' locale to avoid loops)
//     console.log(`Fetching GeoIP from ${request.nextUrl.origin}/en/api/geoip for IP:`, ip);
//     const response = await fetch(`http://localhost:3000/en/api/geoip`, {
//       headers: { 'x-forwarded-for': ip },
//     });

//     if (!response.ok) {
//       console.error(`GeoIP API route error: Status ${response.status}, ${response.statusText}`);
//       throw new Error(`GeoIP API route failed with status ${response.status}`);
//     }

//     const data = await response.json();
//     const countryCode = data.countryCode || 'AE';
//     console.log('GeoIP API route response: Country Code =', countryCode);

//     // Define domain mapping based on country
//     const domainMap = {
//       AE: 'https://ae.ahmedalmaghribi.com', // UAE
//       SA: 'https://ksa.ahmedalmaghribi.com', // Saudi Arabia
//       QA: 'https://qa.ahmedalmaghribi.com', // Qatar
//       OM: 'https://om.ahmedalmaghribi.com', // Oman
//       BH: 'https://bh.ahmedalmaghribi.com', // Bahrain
//       KW: 'https://kw.ahmedalmaghribi.com', // Kuwait
//       default: 'https://ae.ahmedalmaghribi.com', // Others (e.g., US, GB, CA)
//     };

//     // Determine target domain and locale (default to en unless userLocale is set)
//     const targetDomain = domainMap[countryCode] || domainMap.default;
//     const targetLocale = userLocale && routing.locales.includes(userLocale) ? userLocale : 'en';
//     console.log('Target domain:', targetDomain, 'Target locale:', targetLocale);

//     // Remove existing locale prefix from pathname (e.g., /en/about → /about)
//     let cleanPathname = pathname;
//     const currentLocale = pathname.split('/')[1];
//     if (routing.locales.includes(currentLocale)) {
//       cleanPathname = pathname.replace(`/${currentLocale}`, '') || '/';
//     } else if (!['', 'en', 'ar'].includes(currentLocale)) {
//       cleanPathname = '/'; // Prevent /undefined or invalid paths
//     }
//     console.log('Clean pathname:', cleanPathname);

//     // Check if already on the correct domain and locale
//     if (
//       origin === targetDomain &&
//       routing.locales.includes(currentLocale) &&
//       currentLocale === targetLocale
//     ) {
//       console.log('Already on correct domain and locale:', `${origin}/${currentLocale}`);
//       return intlMiddleware(request);
//     }

//     // Redirect to the correct domain and locale
//     if (origin !== targetDomain || currentLocale !== targetLocale) {
//       const redirectPath = `/${targetLocale}${cleanPathname === '/' ? '' : cleanPathname}`;
//       const redirectUrl = new URL(redirectPath, targetDomain);
//       console.log('Redirecting to:', redirectUrl.toString());
//       return NextResponse.redirect(redirectUrl, 302);
//     }
//   } catch (error) {
//     console.error('GeoIP middleware error:', error.message, 'Stack:', error.stack);
//     // Fallback to default domain and locale (en)
//     if (
//       origin !== 'https://ae.ahmedalmaghribi.com' ||
//       (!pathname.startsWith('/en') && !pathname.startsWith('/ar'))
//     ) {
//       let cleanPathname = pathname;
//       const currentLocale = pathname.split('/')[1];
//       if (routing.locales.includes(currentLocale)) {
//         cleanPathname = pathname.replace(`/${currentLocale}`, '') || '/';
//       } else if (!['', 'en', 'ar'].includes(currentLocale)) {
//         cleanPathname = '/';
//       }
//       const redirectUrl = new URL(`/en${cleanPathname === '/' ? '' : cleanPathname}`, 'https://ae.ahmedalmaghribi.com');
//       console.log('Fallback redirect to:', redirectUrl.toString());
//       return NextResponse.redirect(redirectUrl, 302);
//     }
//   }

//   // No redirect needed, proceed with next-intl middleware
//   console.log('No redirect needed, proceeding with next-intl for:', pathname);
//   return intlMiddleware(request);
// }

// export const config = {
//   matcher: [
//     '/((?!api/|_next/static|_next/image|favicon.ico|assets|en\/api|ar\/api).*)',
//     '/',
//     '/(ar|en)/:path*',
//   ],
// };

// export const runtime = 'experimental-edge';