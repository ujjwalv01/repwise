'use client';
import { useState } from 'react';
import Link from 'next/link';
import { googleSignIn } from './actions';
import { X } from 'lucide-react';

export function LoginModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Navbar Buttons ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>

        {/* Ghost — Sign In */}
        <button
          onClick={() => setOpen(true)}
          className="mobile-hide"
          style={{
            background: 'transparent',
            color: '#FFFFFF',
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            border: '1px solid var(--border-default)',
            cursor: 'pointer',
            transition: 'border-color 0.18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        >
          Sign In
        </button>

        {/* Solid orange — Get Started */}
        <button
          onClick={() => setOpen(true)}
          style={{
            background: '#F97316',
            color: '#FFFFFF',
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = '#F97316')}
        >
          Get Started
        </button>
      </div>

      {/* ── Modal Overlay ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              width: '90%',
              maxWidth: '400px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                lineHeight: 1,
              }}
            >
              <X size={15} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <img src="/repwise_icon.png" alt="RepWise Logo" style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'contain' }} />
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 600,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
                Welcome to RepWise
              </h2>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              lineHeight: 1.6,
            }}>
              Sign in to save your progress and access all features.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Google Sign In */}
              <form action={googleSignIn}>
                <button
                  type="submit"
                  style={{
                    background: '#FFFFFF',
                    color: '#111111',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              </div>

              {/* Guest */}
              <Link
                href="/onboarding"
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                Continue as Guest
              </Link>
            </div>

            <p style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '20px',
              textAlign: 'center',
              lineHeight: 1.5,
            }}>
              By continuing, you agree to our{' '}
              <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Terms</span>
              {' & '}
              <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Privacy Policy</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
