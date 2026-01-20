'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Bell } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/' },
        { name: 'Talento', href: '/records' },
        { name: 'Vacantes', href: '/vacancies' },
        { name: 'Configuración', href: '/settings' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-content">
                {/* Logo */}
                <Link href="/" className="nav-brand">
                    <div className="brand-logo">
                        <Zap size={20} fill="currentColor" strokeWidth={0} />
                    </div>
                    <span className="brand-text">Disruptia</span>
                </Link>

                {/* Center Navigation */}
                <div className="nav-links">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Actions */}
                <div className="nav-actions">
                    <button className="nav-icon-btn">
                        <Bell size={20} />
                        <span className="notification-badge"></span>
                    </button>
                    <div className="user-profile-menu">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Profile"
                            className="profile-avatar"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
