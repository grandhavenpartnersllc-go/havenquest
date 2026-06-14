'use client'

import { useState } from 'react'

export default function SystemPage() {
  const [copied, setCopied] = useState(false)

  function copyToClipboard(text: string) {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: '720px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 4px' }}>System Configuration</h1>
      <p style={{ fontSize: '13px', color: '#9A8E82', margin: '0 0 32px' }}>Platform-level settings and configuration</p>

      {/* MD Access Code */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          MD Portal Access Code
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.6 }}>
          The <code style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>NEXT_PUBLIC_MD_ACCESS_CODE</code> env var
          gates entry to the Meridian MD portal. If unset, the access code field is bypassed.
          To update: change the value in Vercel → Project Settings → Environment Variables, then redeploy.
        </p>
        <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <code style={{ fontSize: '13px', color: '#374151', letterSpacing: '0.05em' }}>NEXT_PUBLIC_MD_ACCESS_CODE</code>
          <a
            href="https://vercel.com/grandhavenpartnersllc-go/havenquest/settings/environment-variables"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#0076B6', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            Open in Vercel →
          </a>
        </div>
      </div>

      {/* Supabase Redirect URLs */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Supabase Auth Redirect URLs
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.6 }}>
          Manage allowed redirect URLs in the Supabase dashboard. Required when adding new portal routes.
        </p>
        <a
          href="https://supabase.com/dashboard/project/gsxiqberewwzoohhuphn/auth/url-configuration"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '13px', color: '#0076B6', fontWeight: 600, textDecoration: 'none' }}
        >
          Open URL Configuration →
        </a>
      </div>

      {/* Craig's Admin SQL */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0A1E3D', margin: '0 0 8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Set Admin Role (SQL Reference)
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.6 }}>
          Run this in the Supabase SQL editor to grant a user the admin role:
        </p>
        <div style={{ position: 'relative' }}>
          <pre style={{
            backgroundColor: '#0A1E3D',
            color: '#C5B783',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '12px',
            overflowX: 'auto',
            margin: 0,
            lineHeight: 1.6,
          }}>
{`UPDATE public.users
SET user_role = 'admin'
WHERE email = 'craig.asbach@havenquest.co';`}
          </pre>
          <button
            onClick={() => copyToClipboard(`UPDATE public.users\nSET user_role = 'admin'\nWHERE email = 'craig.asbach@havenquest.co';`)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '4px 10px',
              borderRadius: '5px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '11px',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
