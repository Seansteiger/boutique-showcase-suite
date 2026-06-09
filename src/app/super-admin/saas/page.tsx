"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Building2, Plus, ArrowRight, Play, Settings2, Trash2, ShieldAlert, 
  TrendingUp, CircleDollarSign, Percent, Server, RefreshCw, AlertCircle, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SaaSCommandTowerPage() {
  const tenants = useQuery(api.tenants.getAllTenants);
  const analytics = useQuery(api.tenants.getTenantAnalytics);
  const createTenant = useMutation(api.tenants.createTenant);
  const toggleTenantStatus = useMutation(api.tenants.toggleTenantStatus);
  const deleteTenant = useMutation(api.tenants.deleteTenant);

  // Form states
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [preset, setPreset] = useState("scented");
  
  // Terminal provisioning states
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Dynamic values calculation
  const totalStores = tenants?.length || 0;
  const activeStores = tenants?.filter(t => t.status === "active").length || 0;
  
  const totalRevenue = analytics?.reduce((sum, a) => sum + a.grossRevenue, 0) || 0;
  const totalMRR = analytics?.reduce((sum, a) => sum + a.mrr, 0) || 0;
  const platformFees = analytics?.reduce((sum, a) => sum + a.platformFees, 0) || 0;

  // Onboarding sequence steps
  const PROVISIONING_STEPS = [
    "Initializing brand-launch parameters...",
    "Validating DNS records mapping for local South African zones...",
    "Invoking Vercel Platforms API to register custom hostname...",
    "Creating dynamic isolated schema bindings in Convex collection...",
    "Hydrating visual preset typography, border-radii, and HSL tokens...",
    "Loading default high-definition boutique catalogue configurations...",
    "Activating customer support WhatsApp widgets...",
    "Deployment completed! Brand storefront is live and ready."
  ];

  const handleLaunchStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subdomain) {
      toast.error("Please enter a brand name and subdomain.");
      return;
    }

    setIsProvisioning(true);
    setTerminalLogs([]);
    setCurrentStep(0);

    // Simulate real-time API logs sequence
    for (let i = 0; i < PROVISIONING_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${PROVISIONING_STEPS[i]}`]);
      setCurrentStep(i + 1);
    }

    try {
      await createTenant({
        name,
        subdomain: subdomain.toLowerCase().replace(/\s+/g, "-"),
        customDomain: customDomain || undefined,
        preset
      });

      toast.success(`Store "${name}" provisioned successfully!`);
      // Reset form
      setName("");
      setSubdomain("");
      setCustomDomain("");
    } catch (err: any) {
      toast.error(err.message || "Failed to provision store.");
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleToggleStatus = async (id: any, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await toggleTenantStatus({ id, status: nextStatus });
      toast.success(`Boutique status updated to ${nextStatus}.`);
    } catch (err: any) {
      toast.error(err.message || "Action failed.");
    }
  };

  const handleDelete = async (id: any, storeName: string) => {
    if (!confirm(`Are you absolutely sure you want to decommission "${storeName}"? This will wipe its visual properties.`)) {
      return;
    }
    try {
      await deleteTenant({ id });
      toast.success("Store database maps cleared successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  const handlePreview = (subdomainId: string) => {
    // Commit the subdomain preset preview using the dynamic preview cookie switcher
    document.cookie = `sf_preset_override=${subdomainId}; path=/; max-age=604800`;
    toast.success(`Preview override loaded for: ${subdomainId}`);
    window.open(`/?preview=${subdomainId}`, "_blank");
  };

  return (
    <div className="space-y-8 p-1 font-sans text-xs">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium uppercase tracking-widest text-primary flex items-center gap-2">
            <Building2 className="h-7 w-7 text-accent" /> SaaS Command Tower
          </h1>
          <p className="text-muted-foreground mt-1">
            Productized Multi-Store portfolio dashboard for managing recurring boutique checkouts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="rounded-full border-border/10 flex items-center gap-1.5 hover:bg-secondary/40 text-[10px] tracking-wider uppercase font-bold"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reload Stats
          </Button>
        </div>
      </div>

      {/* Financial Performance KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-border/10 shadow-lg relative overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CircleDollarSign className="h-4 w-4 text-accent" /> Gross Sales
            </CardDescription>
            <CardTitle className="text-2xl font-serif font-medium text-primary pt-1">
              R{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground">Aggregated total transactions across portfolio</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/10 shadow-lg relative overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-green-500" /> Subscription MRR
            </CardDescription>
            <CardTitle className="text-2xl font-serif font-medium text-primary pt-1">
              R{totalMRR.toLocaleString()}/mo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground">Active hosting retaners (R299/mo per store)</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/10 shadow-lg relative overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-emerald-500" /> Platform Fee (1.5%)
            </CardDescription>
            <CardTitle className="text-2xl font-serif font-medium text-primary pt-1">
              R{platformFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground">SaaS gateway yield from active stores</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/10 shadow-lg relative overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Server className="h-4 w-4 text-blue-500" /> Active Tenants
            </CardDescription>
            <CardTitle className="text-2xl font-serif font-medium text-primary pt-1">
              {activeStores} <span className="text-xs text-muted-foreground">/ {totalStores} stores</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground">System runtime status: 100% operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Store Builder Intake form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-[2rem_0.5rem_2rem_0.5rem] border-border/10 shadow-lg relative overflow-hidden bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-lg font-semibold text-primary uppercase tracking-widest">
                Deploy New Boutique Store
              </CardTitle>
              <CardDescription className="text-[10px]">
                Create a dynamic, custom-branded store instance instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLaunchStore} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="storeName" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Boutique Store Name</Label>
                  <Input 
                    id="storeName" 
                    placeholder="e.g. Scented Sandton" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    disabled={isProvisioning}
                    className="bg-secondary/20 border-border/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subdomain" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Subdomain Mapping</Label>
                  <div className="flex">
                    <Input 
                      id="subdomain" 
                      placeholder="sandton" 
                      value={subdomain} 
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/\s+/g, ""))} 
                      required 
                      disabled={isProvisioning}
                      className="bg-secondary/20 border-border/10 rounded-r-none w-full"
                    />
                    <span className="flex items-center px-3 bg-secondary/50 border border-l-0 border-border/10 rounded-r-lg font-bold text-muted-foreground">
                      .yourboutique.co
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="customDomain" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Custom Domain (Optional)</Label>
                  <Input 
                    id="customDomain" 
                    placeholder="e.g. www.scentedsandton.co.za" 
                    value={customDomain} 
                    onChange={(e) => setCustomDomain(e.target.value)} 
                    disabled={isProvisioning}
                    className="bg-secondary/20 border-border/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Visual Identity Preset</Label>
                  <select
                    value={preset}
                    onChange={(e) => setPreset(e.target.value)}
                    disabled={isProvisioning}
                    className="flex h-10 w-full rounded-md border border-border/10 bg-secondary/20 px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="scented">Scented Luxury Preset (Cream/Gold/Green)</option>
                    <option value="slate">Slate Modern Preset (Dark Slate/Steel)</option>
                    <option value="editorial">L'Artelier Stark Preset (Pure Monochrome)</option>
                    <option value="sandstone">Oasis Co Warm Preset (Terracotta/Sand)</option>
                    <option value="ocean">Ocean Mist Cool Preset (Teal/Cyan)</option>
                  </select>
                </div>

                <Button 
                  type="submit" 
                  disabled={isProvisioning || !name || !subdomain}
                  className="w-full py-6 tracking-widest text-[10px] uppercase font-bold bg-primary text-secondary hover:bg-transparent hover:text-primary hover:border hover:border-primary transition-all mt-4 rounded-[2rem_0.5rem_2rem_0.5rem]"
                >
                  {isProvisioning ? "Provisioning..." : "Launch Store Instance"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Provisioning Terminal Log Console */}
          <AnimatePresence>
            {isProvisioning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-black border border-emerald-500/20 text-[#39ff14] p-4 font-mono text-[9px] leading-relaxed shadow-inner overflow-hidden"
              >
                <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2 mb-2">
                  <span className="uppercase tracking-wider font-bold">Launch Console Terminal</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-1 max-h-[160px] overflow-y-auto">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                  {currentStep < PROVISIONING_STEPS.length && (
                    <div className="flex items-center gap-1">
                      <span className="animate-spin">⏳</span>
                      <span>Executing step {currentStep + 1}: {PROVISIONING_STEPS[currentStep]}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Active Tenants Portfolio Listing */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2rem_0.5rem_2rem_0.5rem] border-border/10 shadow-lg relative overflow-hidden bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg font-semibold text-primary uppercase tracking-widest">
                  Store Portfolio Directory
                </CardTitle>
                <CardDescription className="text-[10px]">
                  Manage visual customizers, suspend, or decommission client stores.
                </CardDescription>
              </div>
              <span className="text-[10px] bg-secondary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {totalStores} Configured
              </span>
            </CardHeader>
            <CardContent>
              {!tenants ? (
                <div className="flex justify-center p-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : tenants.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No client stores provisioned yet. Seed some in seedStore or fill the form.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/10">
                  {tenants.map((tenant) => {
                    const stats = analytics?.find(a => a.tenantId === tenant._id.toString() || a.subdomain === tenant.subdomain);
                    
                    return (
                      <div key={tenant._id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors hover:bg-secondary/10 px-2 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-sm font-semibold uppercase text-primary">
                              {tenant.name}
                            </h3>
                            <span className={cn(
                              "text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                              tenant.status === "active" 
                                ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            )}>
                              {tenant.status}
                            </span>
                            <span className="text-[8px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Preset: {tenant.preset}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-sans">
                            Subdomain: <strong className="text-foreground">{tenant.subdomain}.yourboutique.co</strong>
                            {tenant.customDomain && <> | Domain: <strong className="text-foreground">{tenant.customDomain}</strong></>}
                          </p>
                          {stats && (
                            <div className="flex gap-4 text-[9px] uppercase tracking-wider font-bold text-muted-foreground pt-1.5">
                              <span>Revenue: <strong className="text-accent">R{stats.grossRevenue.toLocaleString()}</strong></span>
                              <span>Orders: <strong className="text-foreground">{stats.orderCount}</strong></span>
                              <span>Fees Collected: <strong className="text-foreground">R{stats.platformFees.toFixed(2)}</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Store Action Drawer Controls */}
                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                          <Button
                            size="sm"
                            onClick={() => handlePreview(tenant.subdomain)}
                            className="bg-primary/95 text-secondary hover:bg-primary font-bold text-[9px] uppercase tracking-wider h-8 rounded-md flex items-center gap-1"
                          >
                            <Play className="h-3 w-3" /> Live Demo
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.location.href = `/super-admin/builder?subdomain=${tenant.subdomain}`}
                            className="border-border/10 hover:bg-secondary/40 font-bold text-[9px] uppercase tracking-wider h-8 rounded-md flex items-center gap-1"
                          >
                            <Settings2 className="h-3 w-3" /> Visual Builder
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(tenant._id, tenant.status)}
                            className={cn(
                              "font-bold text-[9px] uppercase tracking-wider h-8 rounded-md",
                              tenant.status === "active" ? "text-amber-600 hover:text-amber-700" : "text-green-600 hover:text-green-700"
                            )}
                          >
                            {tenant.status === "active" ? "Suspend" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(tenant._id, tenant.name)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50/10 h-8 rounded-md"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
