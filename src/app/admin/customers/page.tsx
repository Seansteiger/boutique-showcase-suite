"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCustomers } from "@/app/actions/admin-customers";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            const result = await getCustomers();

            if (result.error) {
                setError(result.error);
                console.error("Error fetching customers:", result.error);
            } else {
                setCustomers(result.customers);
            }
            setLoading(false);
        };

        fetchCustomers();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                <div className="border border-red-200 bg-red-50 rounded-md p-4 text-red-800">
                    Error loading customers: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                <div className="text-sm text-muted-foreground">
                    Total: {customers.length}
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Last Sign In</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-4 w-4" />
                                        </div>
                                        {customer.full_name || "Guest User"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            {customer.email || "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={customer.role === 'admin' ? 'default' : 'secondary'}>
                                            {customer.role || 'customer'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {customer.last_sign_in ? new Date(customer.last_sign_in).toLocaleDateString() : 'Never'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
