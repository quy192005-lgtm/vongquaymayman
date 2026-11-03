'use client';

import React, { useEffect } from 'react';

export const AdNativeBanner: React.FC = () => {
  useEffect(() => {
    const existingScript = document.getElementById('adsterra-native-banner-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'adsterra-native-banner-script';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://bicea.org/21/a97a9e92ffef51dc92cdfaa2570bdc9f';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-4 p-3 bg-slate-900/40 rounded-2xl border border-slate-800/80 shadow-sm flex flex-col items-center">
      <div id="container-a97a9e92ffef51dc92cdfaa2570bdc9f" className="w-full min-h-[50px]" />
    </div>
  );
};
