"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface OverviewChartProps {
    data: { name: string; total: number }[];
}

export function OverviewChart({ data }: OverviewChartProps) {
    // Elegant fallback if no data exists yet
    const chartData = data && data.length > 0 ? data : [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Apr', total: 0 },
    ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                    </linearGradient>
                </defs>
                <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="rgba(128,128,128,0.08)"
                />
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R${value}`}
                    dx={-5}
                />
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border border-white/20 dark:border-slate-800/50 p-3 rounded-lg shadow-xl text-xs font-semibold">
                                    <p className="text-muted-foreground mb-1">{payload[0].payload.name}</p>
                                    <p className="text-primary text-sm font-bold">
                                        R{payload[0].value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#revenueGradient)" 
                    activeDot={{ r: 6, stroke: 'hsl(var(--background))', strokeWidth: 2, fill: 'hsl(var(--primary))' }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
