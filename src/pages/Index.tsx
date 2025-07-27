import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleForm from "@/components/VehicleForm";
import RCTemplate from "@/components/RCTemplate";
import BalanceSection from "@/components/BalanceSection";
import TransactionHistory from "@/components/TransactionHistory";
import { Car, FileText, Wallet, History } from "lucide-react";

const Index = () => {
  const [balance, setBalance] = useState(100); // Default balance
  const [rcData, setRCData] = useState(null);
  const [activeTab, setActiveTab] = useState("generate");

  useEffect(() => {
    // Load balance from localStorage
    const storedBalance = localStorage.getItem('balance');
    if (storedBalance) {
      setBalance(parseInt(storedBalance));
    } else {
      // Set default balance and save to localStorage
      localStorage.setItem('balance', '100');
    }
  }, []);

  const handleRCGenerated = (data: any) => {
    setRCData(data);
    setActiveTab("rc");
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setBalance(newBalance);
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-hero)] animate-fade-in">
      {/* Header */}
      <div className="bg-[image:var(--gradient-card)] shadow-[var(--shadow-elegant)] border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center animate-scale-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-2">
              NH360 Fastag Solutions
            </h1>
            <div className="inline-block bg-[image:var(--gradient-accent)] bg-clip-text text-transparent">
              <p className="text-xl md:text-2xl font-semibold">RC Generator</p>
            </div>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Generate official vehicle registration certificates instantly with our secure and reliable platform
            </p>
            <div className="flex justify-center items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">🔒 Secure</span>
              <span className="flex items-center gap-1">⚡ Fast</span>
              <span className="flex items-center gap-1">✅ Reliable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-[image:var(--gradient-card)] shadow-[var(--shadow-card)] backdrop-blur-sm border-0">
            <TabsTrigger value="generate" className="flex items-center gap-2 data-[state=active]:bg-[image:var(--gradient-primary)] data-[state=active]:text-white transition-all duration-300 hover:scale-105">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Generate RC</span>
            </TabsTrigger>
            <TabsTrigger value="rc" className="flex items-center gap-2 data-[state=active]:bg-[image:var(--gradient-primary)] data-[state=active]:text-white transition-all duration-300 hover:scale-105" disabled={!rcData}>
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">RC Document</span>
            </TabsTrigger>
            <TabsTrigger value="balance" className="flex items-center gap-2 data-[state=active]:bg-[image:var(--gradient-primary)] data-[state=active]:text-white transition-all duration-300 hover:scale-105">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Balance</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-[image:var(--gradient-primary)] data-[state=active]:text-white transition-all duration-300 hover:scale-105">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-8">
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              <div className="xl:w-1/2">
                <VehicleForm 
                  onRCGenerated={handleRCGenerated}
                  balance={balance}
                  onBalanceUpdate={handleBalanceUpdate}
                />
              </div>
              <div className="xl:w-1/2">
                <BalanceSection 
                  balance={balance}
                  onBalanceUpdate={handleBalanceUpdate}
                />
              </div>
            </div>
            
            <div className="bg-[image:var(--gradient-card)] p-8 rounded-2xl shadow-[var(--shadow-card)] border border-primary/10 animate-fade-in">
              <h3 className="font-bold text-xl bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-6 text-center">How it works:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-[image:var(--gradient-primary)] text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold shadow-[var(--shadow-glow)] mb-3 group-hover:animate-glow">1</div>
                  <div className="font-medium text-foreground">Enter Vehicle Number</div>
                  <div className="text-sm text-muted-foreground mt-1">Input your vehicle number in the correct format</div>
                </div>
                <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-[image:var(--gradient-accent)] text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold shadow-[var(--shadow-glow)] mb-3 group-hover:animate-glow">2</div>
                  <div className="font-medium text-foreground">Smart Verification</div>
                  <div className="text-sm text-muted-foreground mt-1">System checks cache first to avoid duplicate charges</div>
                </div>
                <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-[image:var(--gradient-primary)] text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold shadow-[var(--shadow-glow)] mb-3 group-hover:animate-glow">3</div>
                  <div className="font-medium text-foreground">Download Certificate</div>
                  <div className="text-sm text-muted-foreground mt-1">Generate and download your RC as PDF instantly</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rc" className="space-y-6">
            {rcData ? (
              <RCTemplate rcData={rcData} />
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No RC Generated Yet</h3>
                <p>Generate an RC from the first tab to view it here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="balance" className="space-y-6">
            <div className="max-w-md mx-auto">
              <BalanceSection 
                balance={balance}
                onBalanceUpdate={handleBalanceUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-[image:var(--gradient-primary)] text-white py-12 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">NH360 Fastag Solutions</h3>
            <p className="text-lg opacity-90">Professional RC Generation Service</p>
          </div>
          <div className="flex justify-center items-center gap-8 mb-6 text-sm">
            <span className="flex items-center gap-2">🔒 Bank-level Security</span>
            <span className="flex items-center gap-2">⚡ Instant Processing</span>
            <span className="flex items-center gap-2">✅ 99.9% Uptime</span>
          </div>
          <div className="text-sm opacity-75 border-t border-white/20 pt-6">
            <p className="mb-2">Trusted by thousands of users across India</p>
            <p>© 2024 NH360 Fastag Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;