import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ChatWidget } from "@/components/ChatWidget";
import { Toaster } from "@/components/ui/sonner";
import { PawPrint } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4">🐾</div>
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-2xl font-bold">Oops! This pet wandered off</h2>
        <p className="mt-2 text-muted-foreground">The page you're looking for has gone exploring. Let's get you back home.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition">
          <PawPrint className="h-4 w-4" /> Take Me Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again, or head back to safety.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Try again</button>
          <a href="/" className="px-4 py-2 rounded-md border border-border">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PetWorld — Find Your Perfect Companion" },
      { name: "description", content: "PetWorld is the trusted marketplace for adopting and buying pets from verified breeders. Dogs, cats, birds, fish, rabbits and more." },
      { name: "author", content: "PetWorld" },
      { property: "og:title", content: "PetWorld — Find Your Perfect Companion" },
      { property: "og:description", content: "The trusted pet marketplace. Verified breeders, healthy pets, loving homes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1"><Outlet /></main>
          <Footer />
          <ScrollToTop />
          <ChatWidget />
          <Toaster richColors position="top-right" />
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}
