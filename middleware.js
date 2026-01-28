// import createMiddleware from 'next-intl/middleware';
// import {routing} from './i18n/routing';
 
// export default createMiddleware(routing);
 
// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(ar|en)/:path*']
// };

import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  // console.log('Middleware triggered for URL:', request.url);

  // Skip middleware for API routes, including /<locale>/api/*
  if (pathname.startsWith('/api') || pathname.match(/^\/(en|ar)\/api/)) {
    // console.log('Skipping middleware for API route:', pathname);
    return NextResponse.next();
  }
 // Inside your middleware function
if (pathname.includes('/couponRegister')) {
    const adminToken = request.cookies.get('admin-token')?.value;

    if (!adminToken || adminToken !== process.env.ADMIN_PASSWORD) {
        // Redirect to the login page instead of the homepage
        const locale = pathname.split('/')[1] || 'en';
        return NextResponse.redirect(new URL(`/${locale}/couponLogin`, request.url));
    }
}
  // Get the actual domain from headers (handle proxy pass)
  // let host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'http://localhost:3000';
  // let hostHeader = 'https://ae.ahmedalmaghribi.com, ae.ahmedalmaghribi.com';
  // const protocol = request.headers.get('x-forwarded-proto') || 'http';
  // const protocol = 'https';
  // Clean host: take first value, remove ports, trim whitespace, and handle commas
  // host = host.split(',')[0].trim();
  // .split(':')[1].trim();
  // console.log('Raw headers:', {
  //   'x-forwarded-host': request.headers.get('x-forwarded-host'),
  //   host: request.headers.get('host'),
  //   'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
  // });
  // console.log('Cleaned host:', host);

  // // Validate host
  // if (!host || host.includes(',')) {
  //   console.error('Invalid host detected:', host);
  //   host = 'ae.ahmedalmaghribi.com'; // Fallback to default domain
  // }
  // const currentDomain = `${protocol}://${host}`;
  // Normalize the host
  let hostHeader = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'ae.ahmedalmaghribi.com';
  hostHeader = hostHeader.split(',')[0].trim();               // Take first if multiple
  hostHeader = hostHeader.replace(/^https?:\/\//, '');        // Remove protocol
  const domainOnly = hostHeader.split(':')[0].trim();         // Remove port if present

  const currentDomain = `https://${domainOnly}`;
  // console.log('Normalized current domain:', currentDomain);
  // return;

  // Perform GeoIP lookup via API route
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.ip || '217.165.35.39';
    // const ip = '62.215.0.0'; // KW
    // const ip = '92.97.63.173'; // UAE
    // const ip = '159.0.14.172'; // KSA
    // const ip = '37.210.202.22'; // QA
    // const ip = '37.41.136.118'; // OM
    // const ip = '88.201.99.52'; // BH
    // console.log('Client IP:', ip);

    // Fetch GeoIP data from API route (use currentDomain to avoid localhost)
    // console.log(`Fetching GeoIP from http://localhost:3000/en/api/geoip for IP:`, ip);
    const resp = await fetch(`http://localhost:3000/en/api/geoip`, {
      headers: { 'x-forwarded-for': ip },
    });

    if (!resp.ok) {
      // console.error(`GeoIP API route error: Status ${resp.status}, ${resp.statusText}`);
      throw new Error(`GeoIP API route failed with status ${resp.status}`);
    }

    const data = await resp.json();
    const countryCode = data.countryCode || 'AE';
    // console.log('GeoIP API route response: Country Code =', countryCode);

    // Define domain mapping based on country
    const domainMap = {
      AE: 'https://ae.ahmedalmaghribi.com', // UAE
      SA: 'https://ksa.ahmedalmaghribi.com', // Saudi Arabia
      QA: 'https://qa.ahmedalmaghribi.com', // Qatar
      OM: 'https://om.ahmedalmaghribi.com', // Oman
      BH: 'https://bh.ahmedalmaghribi.com', // Bahrain
      KW: 'https://kw.ahmedalmaghribi.com', // Kuwait
      default: 'https://ae.ahmedalmaghribi.com', // Others
    };

    // Determine target domain based on country
    const targetDomain = domainMap[countryCode] || domainMap.default;
    // console.log('Target domain:', targetDomain);

    // Check for country mismatch
    const response = intlMiddleware(request);
    if (currentDomain !== targetDomain) {
      // console.log('Country mismatch detected. Setting countryMismatch cookie.');
      response.cookies.set('countryMismatch', countryCode, { path: '/' }); //, httpOnly: false
    } else {
      // console.log('No country mismatch. Proceeding normally.');
      // Optionally clear the cookie if no mismatch
      response.cookies.delete('countryMismatch');
    }

    return response;
  } catch (error) {
    // console.error('GeoIP middleware error:', error.message);
    // Proceed with next-intl middleware on error (no popup)
    // console.log('Error occurred, proceeding with next-intl for:', pathname);
    return intlMiddleware(request);
  }
}

// export const config = {
//   matcher: [
//     '/((?!api/|_next/static|_next/image|favicon.ico|assets|en\/api|ar\/api).*)',
//     '/',
//     '/(ar|en)/:path*',
//   ],
// };

// In middleware.js

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/ (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets
     * - en/api
     * - ar/api
     * - ANY file with an extension (e.g., .glb, .png, .svg)
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|assets|en\/api|ar\/api|.*\\..*).*)',
    '/',
    '/(ar|en)/:path*',
  ],
};

export const runtime = 'experimental-edge';

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