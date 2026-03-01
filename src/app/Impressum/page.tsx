// src/app/Impressum/page.tsx
'use client';
import React, { useState } from 'react';
import Layout from './layout';
import { impressum } from './texts';

export default function ImpressumPage() {
  const [language, setLanguage] = useState<'de' | 'en'>('de');

  return (
    <Layout>
      <div className="prose prose-invert max-w-3xl">
        <div dangerouslySetInnerHTML={{ __html: impressum[language].replace(/\n/g, '<br/>') }} />
      </div>
    </Layout>
  );
}
