// src/app/AGB/page.tsx
'use client';
import React, { useState } from 'react';
import Layout from './layout';
import { agb } from './texts';

export default function AGBPage() {
  const [language, setLanguage] = useState<'de' | 'en'>('de');

  return (
    <Layout>
      <div className="prose prose-invert max-w-3xl">
        <div dangerouslySetInnerHTML={{ __html: agb[language].replace(/\n/g, '<br/>') }} />
      </div>
    </Layout>
  );
}
