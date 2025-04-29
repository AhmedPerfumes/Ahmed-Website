export async function getCountryFromIP(ip) {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    const data = await res.json();
    console.log('=============================================================================', data);

    if (data.success === false) {
      console.error('Geo lookup failed:', data.message);
      return 'AE';
    }

    return data.country_code || 'AE';
  } catch (err) {
    console.error('Geo API error:', err);
    return null;
  }
}