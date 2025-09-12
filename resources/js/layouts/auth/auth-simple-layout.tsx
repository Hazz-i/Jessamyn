import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    image?: string;
}

export default function AuthSimpleLayout({ children, title, description, image }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative container mx-auto grid min-h-screen grid-cols-1 bg-background md:grid-cols-2">
            {/* Left: Form & Text */}
            <div className="flex items-center justify-center px-2 py-8 md:p-0">
                <div className="flex w-full max-w-lg flex-col gap-8 rounded-2xl border p-5 shadow md:border-none md:px-0 md:py-0 md:shadow-none">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-primary-foreground md:text-5xl">{title}</h1>
                        <p className="text-center text-sm text-primary">{description}</p>
                    </div>
                    {children}
                </div>
            </div>

            {/* Right: Image */}
            <div className="hidden p-6 md:block md:p-10">
                <div className="relative h-full overflow-hidden rounded-3xl border">
                    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
            </div>
        </div>
    );
}
