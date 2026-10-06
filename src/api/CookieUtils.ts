import { jwtDecode } from 'jwt-decode';
import {cookies} from "next/headers";

// Define the shape of the expected JWT payload
interface JwtPayload {
	exp: number;
	[key: string]: any; // optional: allows other fields too
}

export function getTokenExpiryDate(token: string): any {
	try {
		const decoded = jwtDecode<JwtPayload>(token);

		if (!decoded.exp) return null; // fallback if exp is missing

		return new Date(decoded.exp * 1000);
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
}

export function isTokenValid(token: string): boolean {
	const expiryDate = getTokenExpiryDate(token);

	if (!expiryDate) return false;

	return expiryDate.getTime() > Date.now();
}

export const setCookie = async (name: string, value:any, tokenForExpiry?:any) => {
	const cookieStore = await cookies();
	cookieStore.set({
		name: name,
		value: value,
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: getTokenExpiryDate(tokenForExpiry ? tokenForExpiry : value),
	});
}

