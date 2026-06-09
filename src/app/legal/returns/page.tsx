
export default function ReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Refund & Returns Policy</h1>

            <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                    <div className="bg-orange-50 border-l-4 border-primary p-4 mb-8">
                        <p className="font-medium text-black dark:text-white">Our Goal: 100% Student Satisfaction.</p>
                        <p>If you're not happy with your vibe, we're here to fix it.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">1. 7-Day Cooling Off Period</h2>
                    <p>
                        In accordance with the <strong>Consumer Protection Act (CPA)</strong>, you are entitled to return any item within <strong>7 days</strong> of delivery for a full refund (excluding shipping costs), provided that:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>The item is unused and in its original packaging.</li>
                        <li>The item is not a personal hygiene product (e.g., earrings, cosmetics).</li>
                        <li>The proof of purchase is provided.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">2. Defective Products</h2>
                    <p>
                        If you receive a defective or damaged product, please report it to us within <strong>24 hours</strong> of delivery via email at <strong>admin@jozistudenthub.co.za</strong> with photos of the defect.
                        We will arrange for a free collection and replacement or full refund including shipping.
                    </p>
                    <p className="mt-2">
                        Items deemed defective due to wear and tear or misuse will not be accepted.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">3. How to Log a Return</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Email <strong>admin@jozistudenthub.co.za</strong> with your Order Number.</li>
                        <li>State the reason for return and include images if applicable.</li>
                        <li>We will assess your request and provide a Returns Authorization.</li>
                        <li>We will arrange collection or provide instructions for drop-off at a UJ campus.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">4. Refund Process</h2>
                    <p>
                        Refunds are processed within <strong>5-7 working days</strong> after we receive and inspect the returned item.
                        Funds will be returned to the original payment method (e.g., PayFast or EFT).
                    </p>
                </section>
            </div>
        </div>
    );
}
