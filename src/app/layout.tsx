import "./globals.css";
import Providers from "./provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#1f2937] to-[#111827] text-white min-h-screen flex items-center justify-center font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
