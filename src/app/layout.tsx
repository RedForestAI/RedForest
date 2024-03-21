import type { Metadata } from 'next'
import { Providers } from "~/providers";
import "~/styles/globals.css";
import { cn } from "~/utils/cn";
import { Roboto } from "next/font/google";
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
        <head>
          <script src="/webgazer.js" async></script>
        </head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <body
          className={cn(
            "bg-background font-sans antialiased",
            font.className,
          )}
        >
          <TRPCReactProvider headers={headers()}>
            <Providers>
              {children}
            </Providers>
          </TRPCReactProvider>
        </body>
      </html>
    </>
  );
}
