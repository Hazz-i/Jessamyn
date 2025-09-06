import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
            <div className="mx-auto max-w-xl text-center">
                <div className="inline-block rounded-full bg-emerald-50 p-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                    >
                        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Page not found</h1>
                <p className="mt-4 text-base text-gray-600">
                    Sorry, we couldn't find the page you're looking for. <br />
                    It may have been moved or removed. If you typed the address manually, double-check the spelling.
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link href="/">
                        <Button>Back to home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
