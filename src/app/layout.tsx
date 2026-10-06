// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
//
// import ClientCookiesProvider from "@/provider/CookiesProvider";
// import { cookies } from "next/headers";
//
// const inter = Inter({ subsets: ["latin"] });
//
// export const metadata: Metadata = {
//   title: "LifeSpring",
//   description: "LifeSpring",
// };
//
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ClientCookiesProvider value={cookies().getAll()}>
//           {children}
//         </ClientCookiesProvider>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


import ClientCookiesProvider from "@/provider/CookiesProvider";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "LifeSpring",
	description: "LifeSpring",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="en">
		<body className={inter.className}>
		<ClientCookiesProvider value={cookies().getAll()}>
			{children}
		</ClientCookiesProvider>
		</body>
		</html>
	);
}
