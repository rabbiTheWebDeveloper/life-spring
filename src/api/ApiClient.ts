import logger from "@/services/Logger";
import config from "@/types/Config";
import { buildHttpError, isUnauthorized } from "./HttpStatusChecks";
import { buildFetchOptions } from "./RequestBuilder";
import { HttpHeaders, HttpMethod } from "./Types";
import {callRefreshToken} from "@/app/(logged-in)/action/token";


const isResponseJson = (res: Response) => {
	return res.headers.get("content-type")?.includes("application/json");
};

const call = async <T>(
	method: HttpMethod,
	uri: string | (() => string),
	headers: HttpHeaders,
	body: object | undefined = undefined,
	shouldRefresh: boolean = true
): Promise<T> => {
	const options = await buildFetchOptions(method, headers, body);
	const url = typeof uri === "string" ? config.makeApiUrl(uri) : uri();

	const apiCallStartLog = { url, method, headers: options.headers, body };
	logger.apiCallStart(apiCallStartLog);

	const res = await fetch(url, options);
	// if (isUnauthorized(res.status) && "Authorization" in options.headers && shouldRefresh) {
	// 	// await callRefreshToken();
	// 	callRefreshToken()
	// 	return call(method, uri, headers, body, false);
	// }

	if (isUnauthorized(res?.status) && shouldRefresh) {
		await callRefreshToken();
	}

	let data = {};
	if (isResponseJson(res)) {
		try {
			data = await res.json();
			if (data) return data as T;
		} catch (e) {
			data = { message: res.statusText };
			logger.apiFinishedError({ ...apiCallStartLog, status: res.status, data });
			throw buildHttpError(res.status, data);
		}

		if (!res.ok) {
			logger.apiFinishedError({ ...apiCallStartLog, status: res.status, data });
			throw buildHttpError(res.status, data);
		}

		logger.apiFinishedSuccess({ ...apiCallStartLog, status: res.status, data });
		return data as T;
	} else {
		const blob = await res.blob();
		return blob as unknown as T;
	}
};

const callWithResponse = async <T>(
	method: HttpMethod,
	uri: string | (() => string),
	headers: HttpHeaders,
	body: object | undefined = undefined,
	shouldRefresh: boolean = true
): Promise<T> => {
	const options = await buildFetchOptions(method, headers, body);
	const url = typeof uri === "string" ? config.makeApiUrl(uri) : uri();

	const apiCallStartLog = { url, method, headers: options.headers, body };
	logger.apiCallStart(apiCallStartLog);

	const res = await fetch(url, options);
	if (isUnauthorized(res.status) && "Authorization" in options.headers && shouldRefresh) {
		await callRefreshToken();
		return call(method, uri, headers, body, false);
	}

	let data = {};
	if (isResponseJson(res)) {
		try {
			data = await res.json();
			if (data) return data as T;
		} catch (e) {
			data = { message: res.statusText };
			logger.apiFinishedError({ ...apiCallStartLog, status: res.status, data });
			throw buildHttpError(res.status, data);
		}

		if (!res.ok) {
			logger.apiFinishedError({ ...apiCallStartLog, status: res.status, data });
			throw buildHttpError(res.status, data);
		}

		logger.apiFinishedSuccess({ ...apiCallStartLog, status: res.status, data });
		return data as T;
	} else {
		const blob = await res.blob();
		return blob as unknown as T;
	}
};

export function get<T>(uri: string, headers: HttpHeaders = {}): Promise<T> {
	return call(HttpMethod.get, uri, {
		...headers,
		...getDefaultHeaders(),
	});
}

export function getInoive<T>(uri: string, headers: HttpHeaders = {}, customHeaders: HttpHeaders = {}): Promise<T> {
	return call(HttpMethod.get, uri, {
		...headers,
		...customHeaders,
	});
}

export function getWithResponse<T>(uri: string, headers: HttpHeaders = {}): Promise<T> {
	return callWithResponse(HttpMethod.get, uri, {
		...headers,
		...getDefaultHeaders(),
	});
}

export function post<T>(uri: string, body: object, headers: HttpHeaders = {}): Promise<T> {
	return call(
		HttpMethod.post,
		uri,
		{
			...headers,
			...getDefaultHeaders(),
		},
		body
	);
}

export function postWithResponse<T>(uri: string, body: object, headers: HttpHeaders = {}): Promise<T> {
	return callWithResponse(
		HttpMethod.post,
		uri,
		{
			...headers,
			...getDefaultHeaders(),
		},
		body
	);
}

export function put<T>(uri: string, body: object, headers: HttpHeaders = {}): Promise<T> {
	return call(
		HttpMethod.put,
		uri,
		{
			...headers,
			...getDefaultHeaders(),
		},
		body
	);
}

export function putWithResponse<T>(uri: string, body: object, headers: HttpHeaders = {}): Promise<T> {
	return callWithResponse(
		HttpMethod.put,
		uri,
		{
			...headers,
			...getDefaultHeaders(),
		},
		body
	);
}

export function patch<T>(uri: string, body: object, headers: HttpHeaders = {}): Promise<T> {
	return call(
		HttpMethod.patch,
		uri,
		{
			...headers,
			...getDefaultHeaders(),
		},
		body
	);
}

export function patchWithResponse<T>(uri: string, body: object, headers: HttpHeaders = {}): Promise<T> {
	return callWithResponse(
		HttpMethod.patch,
		uri,
		{
			...headers,
			...getDefaultHeaders(),
		},
		body
	);
}

export function del<T>(uri: string, body?: object, headers: HttpHeaders = {}): Promise<T> {
	return call(
		HttpMethod.del,
		uri,
		{
			...headers,
			...getDefaultHeaders(),
		},
		body
	);
}

export function delWithResponse<T>(uri: string, body?: object, headers: HttpHeaders = {}): Promise<T> {
	return callWithResponse(
		HttpMethod.del,
		uri,
		{
			...headers,
			...getDefaultHeaders(),
		},
		body
	);
}

export function delwithbody<T>(uri: string, body: object, headers: HttpHeaders = {}): Promise<T> {
	return call(
		HttpMethod.del,
		uri,
		{
			...headers,
			...getDefaultHeaders(),
		},
		body
	);
}

const getDefaultHeaders = (): HttpHeaders => ({
	Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});
