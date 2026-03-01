// src/app/Datenschutz/page.tsx
'use client';
import React from 'react';
import Layout from './layout';
import { agb } from './datenschutz';

export default function DatenschutzPage() {
  return (
    <Layout>
      {({ language }) => (
        <div className="prose prose-invert max-w-3xl">
          <div dangerouslySetInnerHTML={{ __html: agb[language].replace(/\n/g, '<br/>') }} />
        </div>
      )}
    </Layout>
  );
}
