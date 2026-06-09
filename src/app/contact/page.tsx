import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                        <p className="text-muted-foreground">
                            We're here to help! Whether you have a question about your order, our products, or just want to say hi, feel free to reach out.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span>University of Johannesburg, Auckland Park</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-primary" />
                            <span>+27 11 559 4555</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-primary" />
                            <span>admin@jozistudenthub.co.za</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        {/* WhatsApp Button - Very popular in SA */}
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                            Chat on WhatsApp
                        </Button>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="border p-6 rounded-lg bg-card shadow-sm">
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                        </div>
                        <Button className="w-full">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
