import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BurnoutTest from "@/pages/BurnoutTest";
import { useEffect } from "react";
import { setupOGImage } from "./lib/ogImageGenerator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={BurnoutTest} />
      <Route component={BurnoutTest} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // 앱 로드 시 OG 이미지 설정
    setupOGImage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
