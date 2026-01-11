
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

// Fonction pour obtenir le base path
function getBasePath() {
  // En production sur GitHub Pages, utiliser le nom du repo
  if (import.meta.env.PROD) {
    return "/APO-Link";
  }
  return "";
}

function Router() {
  const basePath = getBasePath();
  
  // Vérifier si on est sur mobile et si le base path est correct
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        console.log('Mobile detected, basePath:', basePath);
        console.log('Current path:', window.location.pathname);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [basePath]);
  
  return (
    <WouterRouter base={basePath}>
    <Switch>
      <Route path="/" component={Home}/>
      <Route component={NotFound} />
    </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
