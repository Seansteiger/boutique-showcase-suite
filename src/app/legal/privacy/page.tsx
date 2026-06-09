
export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: 16 January 2026</p>

            <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">1. Introduction</h2>
                    <p>
                        Jozi Student Hub (Pty) Ltd respects your privacy and is committed to protecting your personal information.
                        This Privacy Policy explains how we collect, use, and protect your data in compliance with the <strong>Protection of Personal Information Act (POPIA)</strong> of South Africa.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">2. Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Personal Details:</strong> Name, surname, email address, physical address, and mobile number.</li>
                        <li><strong>Student Information:</strong> Campus affiliation (e.g., UJ, Wits) for delivery purposes.</li>
                        <li><strong>Payment Information:</strong> We do NOT store card details. All transactions are processed securely via PayFast.</li>
                        <li><strong>Usage Data:</strong> Information about how you use our website (cookies, analytics).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">3. How We Use Your Information</h2>
                    <p>We process your data to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Process and fulfill your orders.</li>
                        <li>Communicate with you regarding order status and updates.</li>
                        <li>Improve our store functionality and user experience.</li>
                        <li>Send marketing communications (only if you have opted in).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">4. Data Security</h2>
                    <p>
                        We implement industry-standard security measures to protect your data. However, no transmission over the internet is completely secure.
                        We encourage you to use distinct passwords and protect your account credentials.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">5. Your Rights</h2>
                    <p>Under POPIA, you have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Request access to the personal information we hold about you.</li>
                        <li>Request correction or deletion of your data.</li>
                        <li>Object to the processing of your data for direct marketing.</li>
                    </ul>
                    <p className="mt-4">To exercise these rights, please contact us at <strong>admin@jozistudenthub.co.za</strong>.</p>
                </section>
            </div>
        </div>
    );
}
