import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { UserMenuContent } from './user-menu-content';

const AppLogo = './jessamynLogo.png';
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: 'bx bx-home',
    },
    {
        title: 'Product',
        href: '/product',
        icon: 'bx bx-box',
    },
    {
        title: 'Account',
        href: '/accounts',
        icon: 'bx bx-user',
    },
    {
        title: 'Transaction',
        href: '/transactions',
        icon: 'bx bx-receipt',
    },
];

const activityNavItems: NavItem[] = [
    {
        title: 'Jurnal Umum',
        href: '/jurnal-umum',
        icon: 'bx bx-user',
    },
    {
        title: 'Buku Besar',
        href: '/buku-besar',
        icon: 'bx bx-receipt',
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <img src={AppLogo} alt="logo aplikasi" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={activityNavItems} title="Activity" />
            </SidebarContent>

            <SidebarFooter>
                <UserMenuContent user={auth.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
