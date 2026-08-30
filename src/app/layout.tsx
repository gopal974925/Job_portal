import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';
import { ThemeProvider } from "@/components/theme-provide";
import { AppProvider } from '@/context/appContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
	title: 'Job Portal',
	description: 'Job Portal Application',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<AppProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Navbar />
						{children}
						<Toaster position="top-right" />
					</ThemeProvider>
				</AppProvider>
			</body>
		</html>
	);
}
