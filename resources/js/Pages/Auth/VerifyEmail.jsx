import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout
            title="Verify your email"
            description="We've emailed you a verification link. Click it to finish setting up your account."
        >
            <Head title="Email Verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit}>
                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Sending…' : 'Resend verification email'}
                </PrimaryButton>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                    Log out
                </Link>
            </form>
        </GuestLayout>
    );
}
