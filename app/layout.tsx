import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Bass Tone Practice",
	description: "Practice locating notes and chords in bass.",
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
