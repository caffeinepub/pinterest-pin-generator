import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PinGenerator from "./components/PinGenerator";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PinGenerator />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
