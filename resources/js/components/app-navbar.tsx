import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';

const navbarMenu = [
    { title: 'Home', href: '/' },
    { title: 'About Us', href: 'about-section' },
    { title: 'Products', href: 'products-section' },
    { title: 'Contact', href: 'contact-section' },
];

type AppNavbarProps = {
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
};

const AppNavbar = ({ mobileOpen, setMobileOpen }: AppNavbarProps) => {
    return (
        <>
            {/* header */}
            <header className="container mx-auto flex items-center justify-between bg-transparent md:px-8">
                <div className="relative h-20 w-auto max-w-[220px]">
                    <img src="/jessamynLogo.png" alt="Logo" className="h-full w-full object-cover" />
                </div>

                <nav className="hidden md:block">
                    <ul className="flex space-x-4">
                        {navbarMenu.map((item) => (
                            <li key={item.title}>
                                {item.href.startsWith('/') ? (
                                    <Link href={item.href} className="hover:underline" preserveScroll>
                                        {item.title}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        className="cursor-pointer border-none bg-transparent hover:underline"
                                        onClick={() => {
                                            if (window.location.pathname !== '/') {
                                                window.location.href = '/';
                                                window.localStorage.setItem('scrollToSection', item.href);
                                            } else {
                                                const el = document.getElementById(item.href);
                                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                    >
                                        {item.title}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="hidden border-gray-200 text-primary sm:inline-flex">
                        Get Started
                    </Button>

                    <button
                        className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                            />
                        </svg>
                    </button>
                </div>
            </header>

            {/* mobile menu */}
            <div className={`${mobileOpen ? 'block' : 'hidden'} px-4 pb-4 md:hidden`}>
                <ul className="flex flex-col space-y-2">
                    {navbarMenu.map((item) => (
                        <li key={item.title}>
                            {item.href.startsWith('/') ? (
                                <Link href={item.href} className="block rounded-md px-3 py-2 hover:bg-gray-100" preserveScroll>
                                    {item.title}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    className="block w-full cursor-pointer rounded-md border-none bg-transparent px-3 py-2 text-left hover:bg-gray-100"
                                    onClick={() => {
                                        if (window.location.pathname !== '/') {
                                            window.location.href = '/';
                                            window.localStorage.setItem('scrollToSection', item.href);
                                        } else {
                                            const el = document.getElementById(item.href);
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            setMobileOpen(false);
                                        }
                                    }}
                                >
                                    {item.title}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {/* scroll to section after navigation to home */}
            {typeof window !== 'undefined' &&
                useEffect(() => {
                    const section = window.localStorage.getItem('scrollToSection');
                    if (section && window.location.pathname === '/') {
                        setTimeout(() => {
                            const el = document.getElementById(section);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            window.localStorage.removeItem('scrollToSection');
                        }, 400);
                    }
                }, [])}
        </>
    );
};

export default AppNavbar;
