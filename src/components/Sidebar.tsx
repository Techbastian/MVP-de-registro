
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    UserPlus,
    Users,
    BarChart3,
    Settings,
    Rocket,
    Plus,
    LayoutDashboard,
    Briefcase
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '#', icon: LayoutDashboard },
        { name: 'Vacancies', href: '/vacancies', icon: Briefcase },
        { name: 'Talent', href: '/records', icon: Users },
        { name: 'Alliances', href: '#', icon: Rocket }, // Using Rocket for Aliances as in brand
        { name: 'Settings', href: '#', icon: Settings },
    ];

    return (
        <aside className="sidebar">
            <Link href="/" className="brand">
                <div className="brand-icon">
                    <Rocket size={24} />
                </div>
                <div className="brand-text">
                    Disruptia
                </div>
            </Link>

            <ul className="nav-menu">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <img
                        src="https://ui-avatars.com/api/?name=Admin+User&background=6200EA&color=fff"
                        alt="Admin"
                        className="avatar"
                    />
                    <div className="user-info">
                        <h5>Admin User</h5>
                        <p>Disruptia Inc.</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
