import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubdomainProvisioningPage } from './pages/SubdomainProvisioningPage';
import { AppLayout } from './components/layout/AppLayout';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <SubdomainProvisioningPage />
      </AppLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
