import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    children,
    title,
    description,
    image,
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    image: string;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} image={image}>
            {children}
        </AuthLayoutTemplate>
    );
}
