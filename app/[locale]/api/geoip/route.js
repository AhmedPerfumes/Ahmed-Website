// import { NextRequest, NextResponse } from 'next/server';
// import { Reader } from '@maxmind/geoip2-node';

// export async function GET(request) {
//   try {
//     const reader = await Reader.open('./lib/geoip/GeoLite2-Country.mmdb');
    // const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.ip || '217.165.35.39';
//     // const ip = '62.215.0.0'; // KW
//     // const ip = '92.97.63.173'; // UAE
//     const ip = '159.0.14.172'; // KSA
//     // const ip = '37.210.202.22'; // QA
//     // const ip = '37.41.136.118'; // OM
//     // const ip = '88.201.99.52'; // BH
//     // console.log('Client IP:', ip);
//     console.log(`GeoIP API route: IP=${ip}`);
//     const { country } = reader.country(ip);
//     const countryCode = country?.isoCode || 'AE';
//     console.log(`GeoIP API route: Country Code=${countryCode}`);
//     return NextResponse.json({ countryCode });
//   } catch (error) {
//     console.error('GeoIP error:', error);
//     return NextResponse.json({ countryCode: 'AE' }, { status: 500 });
//   }
// }

// export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { Reader } from '@maxmind/geoip2-node';

export async function GET(request) {
  try {
    // Ensure the .mmdb file path is correct
    const mmdbPath = './lib/geoip/GeoLite2-Country.mmdb';
    console.log('Attempting to open MaxMind database at:', mmdbPath);
    const reader = await Reader.open(mmdbPath);

    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.ip || '217.165.35.39';
    // const ip = '62.215.0.0'; // KW
    // const ip = '92.97.63.173'; // UAE
    // const ip = '159.0.14.172'; // KSA
    // const ip = '37.210.202.22'; // QA
    // const ip = '37.41.136.118'; // OM
    // const ip = '88.201.99.52'; // BH
    console.log(`GeoIP API route: IP=${ip}`);

    // Perform GeoIP lookup
    const { country } = reader.country(ip);
    const countryCode = country?.isoCode || 'AE'; // Fallback to US
    console.log(`GeoIP API route: Country Code=${countryCode}`);
    return NextResponse.json({ countryCode });
  } catch (error) {
    if (error.name === 'AddressNotFoundError') {
      console.warn(`GeoIP warning: IP ${request.ip} not found in database, defaulting to AE`);
      return NextResponse.json({ countryCode: 'AE' });
    }
    console.error('GeoIP error:', error.message);
    return NextResponse.json({ countryCode: 'AE' }, { status: 500 });
  }
}

export const runtime = 'nodejs';