import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "JNTUH Results Automation",
    description: "Automated JNTUH examination results fetching and caching system",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
