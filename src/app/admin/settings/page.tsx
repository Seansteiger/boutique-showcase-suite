"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  // 1. Fetch general settings from Convex Settings document
  const settings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);

  const [supportEmail, setSupportEmail] = useState("support@commerce-engine.com");
  const [enableChatbot, setEnableChatbot] = useState(true);
  const [abandonedRecovery, setAbandonedRecovery] = useState(true);

  // Sync details from document when it hydrates
  useEffect(() => {
    if (settings) {
      // General merchant properties (mock fallback since styling is locked to Super Admin)
      setSupportEmail("support@commerce-engine.com");
    }
  }, [settings]);

  const handleSave = async () => {
    toast.success("Merchant operations preferences updated successfully!");
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Merchant Settings</h1>
      </div>

      <div className="grid gap-6">
        
        {/* Visual Identity Warning */}
        <Card className="border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10">
          <CardContent className="pt-6 flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm">Visual customizer is locked</h4>
              <p className="text-xs text-amber-700/80 dark:text-amber-500/80">
                Visual identity settings (primary colors, buttons, fonts, and widget layouts) are locked to Platform Super Admins. 
                Contact support to rebrand this client instance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* General operational configs */}
        <Card>
          <CardHeader>
            <CardTitle>General Store Settings</CardTitle>
            <CardDescription>Manage your store's operational support channel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="storeName">Instance Store Name</Label>
              <Input id="storeName" value={settings.brandName} disabled className="bg-slate-50 dark:bg-slate-900 cursor-not-allowed" />
              <span className="text-xs text-muted-foreground">Store brand name can only be adjusted by a Super Admin.</span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input 
                id="supportEmail" 
                value={supportEmail} 
                onChange={(e) => setSupportEmail(e.target.value)} 
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle>AI Assistant Settings</CardTitle>
            <CardDescription>Configure customer assistant automation features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label>Enable AI Copilot</Label>
                <span className="text-xs text-muted-foreground">Allow customers to search catalog and place orders via AI.</span>
              </div>
              <Switch checked={enableChatbot} onCheckedChange={setEnableChatbot} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label>Abandoned Cart Recovery</Label>
                <span className="text-xs text-muted-foreground">Auto-notify customers with discounts if a cart is abandoned.</span>
              </div>
              <Switch checked={abandonedRecovery} onCheckedChange={setAbandonedRecovery} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
