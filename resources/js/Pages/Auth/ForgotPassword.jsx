import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout
            title="Reset your password"
            description="Enter your email and we'll send you a link to choose a new password."
        >
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <InputLabel htmlFor="email" value="Email" />

                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    placeholder="you@example.com"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <PrimaryButton className="mt-5 w-full" disabled={processing}>
                    {processing ? 'Sending…' : 'Email password reset link'}
                </PrimaryButton>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                <Link
                    href={route('login')}
                    className="font-medium text-green-700 hover:text-green-800 transition-colors"
                >
                    Back to log in
                </Link>
            </p>
        </GuestLayout>
    );
}
