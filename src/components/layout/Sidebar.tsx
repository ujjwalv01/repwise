'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Utensils, Dumbbell, Droplets,
  TrendingUp, Target, Calendar, User, Settings, Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/nutrition',  icon: Utensils,         label: 'Nutrition'  },
  { href: '/workout',    icon: Dumbbell,         label: 'Workout'    },
  { href: '/hydration',  icon: Droplets,         label: 'Hydration'  },
  { href: '/progress',   icon: TrendingUp,       label: 'Progress'   },
  { href: '/goals',      icon: Target,           label: 'Goals'      },
  { href: '/meal-plan',  icon: Calendar,         label: 'Meal Plan'  },
];

const BOTTOM_ITEMS = [
  { href: '/profile',  icon: User,     label: 'Profile'  },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

/* ── Single icon row ─────────────────────────────────────────── */
function SidebarIcon({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',          /* full 64px sidebar width */
        height: '44px',         /* min touch target height  */
        textDecoration: 'none',
      }}
    >
      {/* Left-edge orange indicator */}
      {active && (
        <span style={{
          position: 'absolute',
          left: 0,
          top: '20%',
          height: '60%',
          width: '2px',
          background: '#F97316',
          borderRadius: '0 2px 2px 0',
        }} />
      )}

      {/* Icon hit-target box (44×44, centered) */}
      <span
        className={active ? 'sb-icon sb-icon--active' : 'sb-icon'}
        style={{ color: active ? '#F97316' : '#6B7280' }}
      >
        <Icon size={20} strokeWidth={1.75} />
      </span>
    </Link>
  );
}

/* ── Mobile Nav ────────────────────────────────────────────────── */
function MobileNav() {
  const pathname = usePathname();
  const mainItems = NAV_ITEMS.slice(0, 5); // Just 5 icons max for bottom nav

  return (
    <nav className="mobile-only" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'rgba(13, 13, 13, 0.85)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {mainItems.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            textDecoration: 'none',
            color: active ? '#F97316' : '#6B7280',
            transition: 'color 0.2s',
          }}>
            <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
          </Link>
        );
      })}
      {/* Profile as the last item */}
      <Link href="/profile" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        textDecoration: 'none',
        color: pathname === '/profile' ? '#F97316' : '#6B7280',
      }}>
        <User size={22} strokeWidth={pathname === '/profile' ? 2.5 : 1.75} />
        <span style={{ fontSize: '10px', fontWeight: 500 }}>Profile</span>
      </Link>
    </nav>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────── */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="mobile-hide" style={{
        width: '64px',
        minWidth: '64px',
        height: '100vh',
        background: '#0D0D0D',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}>

        {/* ── Logo ── */}
        <div style={{
          width: '64px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#F97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={18} color="#fff" fill="#fff" strokeWidth={0} />
          </div>
        </div>

        {/* ── Main Nav ── */}
        <nav style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 0',
          gap: '2px',
        }}>
          {NAV_ITEMS.map(({ href, icon, label }) => (
            <SidebarIcon
              key={href}
              href={href}
              icon={icon}
              label={label}
              active={pathname === href}
            />
          ))}
        </nav>

        {/* ── Bottom Section ── */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          paddingBottom: '10px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '10px',
        }}>
          {BOTTOM_ITEMS.map(({ href, icon, label }) => (
            <SidebarIcon
              key={href}
              href={href}
              icon={icon}
              label={label}
              active={pathname === href}
            />
          ))}
        </div>
      </aside>

      <MobileNav />
    </>
  );
}
