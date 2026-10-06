import { get } from "@/api/ApiClient";
import { TokenManager } from "@/api/TokenManager";
import {UserCommonData } from "@/types/User";

const isLoggedIn = async () => {
	return await TokenManager.hasValid();
};

const isNotLoggedIn = async () => {
	return !(await isLoggedIn());
};

const login = async <T extends { id: number }>(responseData: any) => {
	const userId = responseData?.user?.id ?? null
	const accessToken = responseData?.accessToken ?? ""
	const refreshToken = responseData?.refreshToken ?? ""

	await TokenManager.set({
		id:userId,
		accessToken,
		refreshToken,
	});
};

const logout = async () => {
	await TokenManager.remove();

};

// const login = async <T extends { id: number }>(user: LoggedInUser<T>) => {
// 	console.log(user);
//
// 	await TokenManager.set({
// 		id: user.user.id,
// 		accessToken: user.accessToken,
// 		refreshToken: user.refreshToken,
// 	});
// };
//
// const logout = async () => {
// 	await TokenManager.remove();
// };

const getLoggedUser = async (): Promise<UserCommonData> => {
	const userId = await TokenManager.getUserId();
	return await get<UserCommonData>(`v1/user/${userId}`);
};

const isAdmin = async () => {
	const isAdmin = await AuthManager.getLoggedUser();
	return isAdmin.role === "Admin";
};
const AuthManager = {
	login,
	logout,
	isLoggedIn,
	isNotLoggedIn,
	getLoggedUser,
	isAdmin,
};

export default AuthManager;
