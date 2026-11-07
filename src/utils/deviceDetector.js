/**
 * Utilitas pendeteksi spesifikasi perangkat pengguna (Device, OS, Browser).
 * Digunakan untuk audit log keamanan dan aktivitas login di TeraDesk.
 */
export const getDeviceInfo = () => {
  if (typeof window === 'undefined' || !window.navigator) {
    return {
      os: 'Unknown OS',
      browser: 'Unknown Browser',
      type: 'Desktop',
      summary: 'Perangkat Tidak Dikenal',
    };
  }

  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';

  // 1. Deteksi Jenis Perangkat (Device Type)
  let type = 'Desktop';
  const isTablet = /tablet|ipad|playbook|silk/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua);

  if (isTablet) {
    type = 'Tablet';
  } else if (isMobile) {
    type = 'Mobile';
  } else {
    type = 'Desktop';
  }

  // 2. Deteksi Sistem Operasi (OS)
  let os = 'Sistem Tidak Dikenal';
  if (/windows nt 10.0/i.test(ua)) {
    os = 'Windows 10/11';
  } else if (/windows nt 6.3/i.test(ua)) {
    os = 'Windows 8.1';
  } else if (/windows nt 6.2/i.test(ua)) {
    os = 'Windows 8';
  } else if (/windows nt 6.1/i.test(ua)) {
    os = 'Windows 7';
  } else if (/windows/i.test(ua)) {
    os = 'Windows';
  } else if (/android/i.test(ua)) {
    const match = ua.match(/Android\s([0-9.]+)/i);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (/iphone/i.test(ua)) {
    const match = ua.match(/OS\s([0-9_]+)/i);
    os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS (iPhone)';
  } else if (isTablet && (/ipad/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1))) {
    os = 'iPadOS';
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = 'macOS';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
  } else if (/cros/i.test(ua)) {
    os = 'ChromeOS';
  }

  // 3. Deteksi Peramban Web (Browser)
  let browser = 'Browser Web';
  if (/edg/i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/samsungbrowser/i.test(ua)) {
    browser = 'Samsung Internet';
  } else if (/opr|opera/i.test(ua)) {
    browser = 'Opera';
  } else if (/chrome|crios/i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Mozilla Firefox';
  }

  const summary = `${browser} di ${os} (${type})`;

  return {
    os,
    browser,
    type, // 'Desktop' | 'Mobile' | 'Tablet'
    summary,
  };
};

