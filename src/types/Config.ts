import { trimChar } from "@/helper/StringHelper";

enum AppMode {
	development = "development",
	production = "production",
}

export interface Config {
	appMode: AppMode;
	isInProduction: () => boolean;
	adminPublicUrl: string;
	apiUrl: string;
	makeApiUrl: (path: string) => string;
	mapKey: string;
	hostURL: string | undefined;
}

const getAppMode = (): AppMode => {
	const mode = process.env.APP_MODE;
	if (!mode) return AppMode.production;
	if (!(mode in AppMode)) return AppMode.production;

	return mode as AppMode;
};


const adminPublicUrl = process.env.ADMIN_PUBLIC_URL ?? "http://admin.shukhee.test";
const apiUrl = process.env.API_BASE_URL ?? "http://shukhee-api-service:8080";
const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ?? "";
const appMode = getAppMode();

const hostURL = process.env.NEXT_PUBLIC_PAHO ?? "";
const config: Config = {
	appMode,
	isInProduction: () => appMode === AppMode.production,
	adminPublicUrl,
	apiUrl,
	makeApiUrl: (path: string) => {
		// return `${trimChar(apiUrl, "/")}/api/v1/${trimChar(path, "/")}`;
		return `${trimChar(apiUrl, "/")}/${trimChar(path, "/")}`;

	},
	mapKey,
	hostURL,
};

export default config;
