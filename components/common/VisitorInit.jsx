'use client';

import { useEffect } from 'react';
import { initVisitorTracking } from '@/lib/visitorId';

if (typeof window !== 'undefined') {
  initVisitorTracking();
}

export default function VisitorInit() {
  useEffect(() => {
    initVisitorTracking();
  }, []);

  return null;
}
