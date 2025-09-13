import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { Link, router, usePage } from '@inertiajs/react';

export function UserMenuContent() {
    const page = usePage();
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.post(route('logout'));
    };

    return (
        <>
            <SidebarGroup className="px-2 py-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={page.url.startsWith('/profile')} tooltip={{ children: 'Profile' }}>
                            <Link className="block w-full cursor-pointer" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                                <i className="bx bx-cog mr-2" />
                                Settings
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{ children: 'Log out' }}>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <p className="block w-full cursor-pointer rounded-lg p-2 text-sm text-destructive hover:bg-red-500/10 hover:text-red-600">
                                        <i className="bx bx-log-out mr-2" />
                                        Logout
                                    </p>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will log you out of the current session.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="cursor-pointer bg-destructive text-white hover:bg-destructive"
                                            onClick={handleLogout}
                                        >
                                            <i className="bx bx-log-out mr-2" />
                                            Log out
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
