// src/app/Datenschutz/page.tsx
'use client';
import React, { useState } from 'react';
import Layout from './layout';
import { datenschutz } from './texts';

export default function DatenschutzPage() {
  const [language, setLanguage] = useState<'de' | 'en'>('de');

  return (
    <Layout>
      <div className="prose prose-invert max-w-3xl">
        <div dangerouslySetInnerHTML={{ __html: datenschutz[language].replace(/\n/g, '<br/>') }} />
      </div>
    </Layout>
  );
}
