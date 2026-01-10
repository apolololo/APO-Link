
import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

// Fonction pour obtenir le base path
function getBasePath() {
  // En production sur GitHub Pages, utiliser le nom du repo
  if (import.meta.env.PROD) {
    return "/apo-reseaux-site";
  }
  return "";
}

function Router() {
  const basePath = getBasePath();
  
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
