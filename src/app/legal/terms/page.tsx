
export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: 16 January 2026</p>

            <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using the Jozi Student Hub website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">2. Products & Pricing</h2>
                    <p>
                        We adhere to the <strong>Electronic Communications and Transactions Act (ECTA)</strong>.
                        Prices are displayed in South African Rand (ZAR) and are subject to change without notice.
                        While we strive for accuracy, errors in pricing or product descriptions may occur. In such cases, we reserve the right to cancel orders.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">3. Delivery Policy</h2>
                    <p>
                        Detailed delivery terms are available on our <a href="/legal/delivery" className="text-primary hover:underline">Delivery Information</a> page.
                        We are not liable for delays caused by third-party couriers or force majeure events.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">4. Returns & Refunds</h2>
                    <p>
                        Our Returns Policy is aligned with the <strong>Consumer Protection Act (CPA)</strong>.
                        Please review our <a href="/legal/returns" className="text-primary hover:underline">Refund Policy</a> for detailed procedures on returns and exchanges.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">5. User Conduct</h2>
                    <p>
                        You agree not to use our website for any unlawful purpose. Harassment, duplicate account creation to abuse promotions,
                        or attempts to breach our security are strictly prohibited and will result in account termination.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">6. Limitation of Liability</h2>
                    <p>
                        Jozi Student Hub shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service or products,
                        to the extent permitted by South African law.
                    </p>
                </section>
            </div>
        </div>
    );
}
