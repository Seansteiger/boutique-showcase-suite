
export default function DeliveryPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Delivery Information</h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">

                <section className="bg-black text-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-primary">🚀 Free Delivery Zones</h2>
                    <p className="text-lg mb-4">
                        We offer <strong>FREE Delivery</strong> to all UJ Campuses and surrounding student areas (within 2km).
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> UJ Auckland Park (APK)</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> UJ Bunting Road (APB)</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> UJ Doornfontein (DFC)</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> UJ Soweto (SWC)</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Melville / Westdene</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Brixton / Hursthill</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Braamfontein (Wits)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">3. Paxi (Nationwide Collection)</h2>
                    <p>
                        We use Paxi (PEP Stores) for robust nationwide delivery.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Standard (R60):</strong> 7-9 Business days.</li>
                        <li><strong>Express (R110):</strong> 3-5 Business days.</li>
                        <li>You will collect your parcel from your nearest PEP store.</li>
                        <li>You will receive an SMS when it's ready for collection.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Standard Delivery Rates</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-4 border">Location / Method</th>
                                    <th className="p-4 border">Cost</th>
                                    <th className="p-4 border">Estimated Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-4 border">Greater JHB (Uber/Courier)</td>
                                    <td className="p-4 border font-bold">R75.00</td>
                                    <td className="p-4 border">24-72 Hours</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border">Nationwide (Paxi Standard)</td>
                                    <td className="p-4 border font-bold">R60.00</td>
                                    <td className="p-4 border">7-9 Working Days</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border">Nationwide (Paxi Express)</td>
                                    <td className="p-4 border font-bold">R110.00</td>
                                    <td className="p-4 border">3-5 Working Days</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border">Johannesburg Door-to-Door</td>
                                    <td className="p-4 border font-bold">R120.00</td>
                                    <td className="p-4 border">24-72 Hours</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 bg-blue-50 p-4 rounded-md text-sm text-blue-800 border-l-4 border-blue-500">
                        <p className="font-semibold">Uber Delivery Savings Guarantee:</p>
                        <p>
                            If the actual Uber Package delivery cost is less than R75 (and the difference is greater than R10),
                            we will issue you a coupon for the balance upon successful delivery!
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Order Tracking</h2>
                    <p>
                        Once your order is dispatched, you will receive an email with your Waybill Number and a link to track your parcel.
                        For campus deliveries, we will contact you via WhatsApp to arrange a convenient meetup spot on campus.
                    </p>
                    <p className="mt-4 font-bold text-primary">
                        Your safety comes first.
                    </p>
                </section>
            </div>
        </div>
    );
}
