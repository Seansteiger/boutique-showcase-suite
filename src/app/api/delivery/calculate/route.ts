import { NextResponse } from "next/server";

export const runtime = "edge";

const ORIGIN_ADDRESS = "University of Johannesburg, Kingsway Campus, Auckland Park, Johannesburg";

const LOCAL_TIERS = [
    { tier_name: "University Campuses (UJ & Wits) & Surrounds", price: 0, suburbs: ["wits", "uj", "kingsway", "bunting", "doornfontein", "soweto", "melville", "braamfontein", "auckland park"] },
    { tier_name: "Greater JHB Local Courier", price: 75, suburbs: ["johannesburg", "rosebank", "sandton", "randburg", "midrand", "fourways", "soweto", "roodepoort"] }
];

export async function POST(req: Request) {
    try {
        const { address } = await req.json();

        if (!address) {
            return NextResponse.json({ error: "Address is required" }, { status: 400 });
        }

        // 1. Try to match the address against deterministic local tiers
        let foundTier: any = null;
        const lowerAddress = address.toLowerCase();

        for (const tier of LOCAL_TIERS) {
            for (const sub of tier.suburbs) {
                // Check if the exact suburb name exists in the address string
                if (lowerAddress.includes(sub)) {
                    foundTier = tier;
                    break;
                }
            }
            if (foundTier) break;
        }

        if (foundTier) {
            // IF we found a tier, use deterministic pricing and skip Google Maps!
            const price = Number(foundTier.price);
            return NextResponse.json({
                distanceKm: 0, // Mocked since we skipped Google Maps
                durationMins: Math.floor((price / 10) * 4) + 15, // Mock reasonable duration representation based on cost
                uberCost: price,
                isLongDistance: false,
                suggestPaxi: price > 250, // Flag for Paxi suggestion
                paxiOptions: getPaxiOptions(),
                tierFound: foundTier.tier_name
            });
        }

        // 2. FALLBACK to Google Maps API if no tier found
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            const isFar = address.toLowerCase().includes("cape town") || address.toLowerCase().includes("durban");
            const durationMins = isFar ? 120 : 45;
            const distanceKm = isFar ? 1400 : 15;
            const uberCost = calculateUberCost(distanceKm, durationMins);

            return NextResponse.json({
                distanceKm,
                durationMins,
                uberCost,
                isLongDistance: durationMins > 90,
                suggestPaxi: uberCost > 250,
                paxiOptions: getPaxiOptions(),
                mock: true
            });
        }

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(ORIGIN_ADDRESS)}&destinations=${encodeURIComponent(address)}&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK" || !data.rows[0] || !data.rows[0].elements[0]) {
            throw new Error("Failed to calculate distance");
        }

        const element = data.rows[0].elements[0];

        if (element.status !== "OK") {
            return NextResponse.json({ error: "Could not calculate delivery to this address." }, { status: 400 });
        }

        const distanceKm = element.distance.value / 1000;
        const durationMins = Math.ceil(element.duration.value / 60);

        let uberCost = calculateUberCost(distanceKm, durationMins);

        // FREE DELIVERY RULE: If distance is 2km or less, delivery is free.
        if (distanceKm <= 2) {
            uberCost = 0;
        }

        const isLongDistance = durationMins > 90;
        const suggestPaxi = uberCost > 250;

        return NextResponse.json({
            distanceKm,
            durationMins,
            uberCost,
            isLongDistance,
            suggestPaxi,
            paxiOptions: getPaxiOptions()
        });

    } catch (error) {
        console.error("Delivery Calculation Error:", error);
        return NextResponse.json({ error: "Failed to calculate delivery" }, { status: 500 });
    }
}

function calculateUberCost(distanceKm: number, durationMins: number) {
    const base = 20;
    const perKm = 10;
    const perMin = 1;
    let cost = base + (distanceKm * perKm) + (durationMins * perMin);
    return Math.ceil((cost * 1.1) / 10) * 10;
}

function getPaxiOptions() {
    return [
        { id: 'zone-paxi', name: 'Paxi Standard (7-9 Days)', price: 60 },
        { id: 'zone-paxi-express', name: 'Paxi Express (3-5 Days)', price: 110 }
    ];
}
