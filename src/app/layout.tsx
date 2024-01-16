import type { Metadata } from 'next'
import { TailwindIndicator } from "~/components/TailwindIndicator";
import { Providers } from "~/providers";
import "~/styles/globals.css";
import { cn } from "~/utils/cn";
import { Roboto } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: 'RedForest',
  description: 'AI-powered reading assistance',
}

const font = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <html lang="en">
        <head />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            font.className,
          )}
        >
          <TRPCReactProvider headers={headers()}>
              <Providers>
                {children}
                <Toaster />
              </Providers>
          </TRPCReactProvider>
          <TailwindIndicator />
        </body>
      </html>
    </>
  );
}