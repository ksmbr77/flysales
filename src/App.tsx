import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy loading para performance
const Index = lazy(() => import("./pages/Index"));
const Metas = lazy(() => import("./pages/Metas"));
const Comercial = lazy(() => import("./pages/Comercial"));
const CRM = lazy(() => import("./pages/CRM"));
const ClientesAtivos = lazy(() => import("./pages/ClientesAtivos"));
const FunilVendas = lazy(() => import("./pages/FunilVendas"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Suporte = lazy(() => import("./pages/Suporte"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Carregando...</div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/comercial" element={<ProtectedRoute><Comercial /></ProtectedRoute>} />
              <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
              <Route path="/clientes-ativos" element={<ProtectedRoute><ClientesAtivos /></ProtectedRoute>} />
              <Route path="/funil-vendas" element={<ProtectedRoute><FunilVendas /></ProtectedRoute>} />
              <Route path="/metas" element={<ProtectedRoute><Metas /></ProtectedRoute>} />
              <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
              <Route path="/suporte" element={<ProtectedRoute><Suporte /></ProtectedRoute>} />
              <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
