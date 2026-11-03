'use client';

import React, { useEffect, useRef } from 'react';

export const AdBanner468x60: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    bannerRef.current.innerHTML = '';

    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.innerHTML = `
      atOptions = {
        'key' : '5000b31fc182c45d42595ec12146a6fc',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://bicea.org/22/5000b31fc182c45d42595ec12146a6fc';

    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full max-w-[468px] mx-auto my-4 min-h-[60px] flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/40 border border-slate-800/60 shadow-sm">
      <div ref={bannerRef} className="flex justify-center" />
    </div>
  );
};
