import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    image?: string;
}

export default function AuthSimpleLayout({ children, title, description, image }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative container mx-auto grid min-h-screen grid-cols-2 bg-background">
            <div className="flex items-center justify-center">
                <div className="flex flex-col gap-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-5xl font-bold text-primary-foreground">{title}</h1>
                        <p className="text-center text-sm text-primary">{description}</p>
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
