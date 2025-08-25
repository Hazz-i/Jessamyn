import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    image?: string;
}

export default function AuthSimpleLayout({ children, title, description, image }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative grid min-h-screen grid-cols-2 bg-background">
            <div className="flex items-center justify-center">
                <div className="flex flex-col gap-8">
                    <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                        <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                        </div>
                        <span className="sr-only">{title}</span>
                    </Link>

                    <div className="space-y-2 text-center">
                        <h1 className="text-5xl font-bold">{title}</h1>
                        <p className="text-center text-sm text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>

            <div className="p-6 md:p-10">
                <div className="relative h-full overflow-hidden rounded-3xl border">
                    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
            </div>
        </div>
    );
}
