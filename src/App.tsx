import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoleSelect from "@/pages/RoleSelect";
import AssemblerApp from "@/pages/AssemblerApp";
import CustomerApp from "@/pages/CustomerApp";

export type Role = "assembler" | "customer" | null;

const queryClient = new QueryClient();

const App = () => {
  const [role, setRole] = useState<Role>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!role && <RoleSelect onSelect={setRole} />}
        {role === "assembler" && <AssemblerApp onLogout={() => setRole(null)} />}
        {role === "customer" && <CustomerApp onLogout={() => setRole(null)} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
