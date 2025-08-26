import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const page = usePage();
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <SidebarGroup className="px-2 py-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={page.url.startsWith('/profile')} tooltip={{ children: 'Profile' }}>
                            <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                                <Settings className="mr-2" />
                                Settings
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{ children: 'Log out' }}>
                            <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                                <LogOut className="mr-2" />
                                Log out
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
