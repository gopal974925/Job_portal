import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/navbar';
import { ThemeProvider} from "@/components/theme-provide";


export const metadata: Metadata = {
	title: 'Frontend',
	description: 'Frontend application',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>

			<body>
				<ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
			  <Navbar/>
                {children}
		  </ThemeProvider>
              
                
                </body>
		</html>
	)
}
