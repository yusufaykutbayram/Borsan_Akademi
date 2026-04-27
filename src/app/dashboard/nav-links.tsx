'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks() {
    const pathname = usePathname()

    const links = [
        { href: '/dashboard', label: 'Ana Sayfa' },
        { href: '/dashboard/trainings', label: 'Eğitimler' },
        { href: '/dashboard/quizzes', label: 'Quizler' },
        { href: '/dashboard/competition', label: 'Yarışma' },
        { href: '/dashboard/ai-chat', label: 'Gelişim Asistanı' },
        { href: '/dashboard/profile', label: 'Profilim' },
    ]

    return (
        <nav className="hidden md:flex space-x-8">
            {links.map((link) => {
                const isActive = pathname === link.href
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                            isActive 
                            ? 'text-gray-900 border-primary' 
                            : 'text-gray-500 border-transparent hover:text-primary hover:border-primary/30'
                        }`}
                    >
                        {link.label}
                    </Link>
                )
            })}
        </nav>
    )
}
