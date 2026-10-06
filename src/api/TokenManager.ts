import {TokensWithId} from "@/types/User";
import {cookies} from "next/headers";
import {isTokenValid, setCookie} from "@/api/CookieUtils";
import {removeCookies} from "@/app/(logged-in)/action/token";

const tokenStore = {
	key: () => {
		return `tokens`;
	},
	save: async (tokens: TokensWithId) => {
		const {id, accessToken, refreshToken} = tokens
		await setCookie("userId", id, refreshToken);
		await setCookie("accessToken", accessToken);
		await setCookie("refreshToken", refreshToken);
	},
	find: async (): Promise<any> => {
		// Retrieve tokens from cookies
		const id = TokenManager.getCookieValue("userId");
		const accessToken = TokenManager.getCookieValue("userId");
		const refreshToken = TokenManager.getCookieValue("refreshToken");

		if (!id || !accessToken || !refreshToken) return undefined;

		return {
			id: String(id),
			accessToken: String(accessToken),
			refreshToken: String(refreshToken),
		};

	},
	delete: async () => {
		// Remove cookies
		removeCookies()
	},
};

export class TokenManager {
	public static async hasValid() {
		const accessToken = await TokenManager.getCookieValue("accessToken");
		let returnValue: boolean;
		if (!accessToken) {
			returnValue = false
		} else {
			returnValue = isTokenValid(accessToken)
		}
		return returnValue
	}

	public static async getUserId() {
		return cookies().get('userId')?.value || "";
	}

	static async getCookieValue(name: string) {
		return cookies().get(name)?.value || "";
	}

	public static async getAccessToken() {
		return await TokenManager.getCookieValue("accessToken");
	}

	public static async getRefreshToken() {
		return await TokenManager.getCookieValue("refreshToken");
	}

	public static async set(tokens: { accessToken: string, refreshToken: string, id: number | any }) {
		await tokenStore.save(tokens);
	}

	public static async remove() {
		await tokenStore.delete();
	}

	// private static removeRequest() {
	// 	TokenManager.ongoingRequest = undefined;
	// }

	// static async refresh(request: Promise<TokensWithId>) {
	// 	try {
	// 		const tokens = await TokenManager.getRequest(request);
	// 		tokens.id = tokens.user?.id;
	// 		await tokenStore.save(tokens);
	// 	} catch (e) {
	// 		if (e instanceof HttpUnautorizedError) {
	// 			await TokenManager.removeTokens();
	// 			redirect("/login", RedirectType.replace);
	// 		}
	// 	} finally {
	// 		TokenManager.removeRequest();
	// 	}
	// }
}
