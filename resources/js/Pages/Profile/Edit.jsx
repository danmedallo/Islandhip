import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout>
            <Head title="Profile" />

            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1
                    className="text-xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: "'Georgia', serif" }}
                >
                    Your profile
                </h1>

                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <UpdatePasswordForm />
                    </div>

                    <div className="bg-white border border-red-200 rounded-xl p-6">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
