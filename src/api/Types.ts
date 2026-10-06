export type HttpHeaders = { [key: string]: string };

export enum HttpMethod {
	get = "GET",
	post = "POST",
	put = "PUT",
	patch = "PATCH",
	del = "DELETE",
}

export interface FetchOption {
	method: HttpMethod;
	headers: HttpHeaders;
	body?: string | FormData;
}

export interface ApiCallStartLog {
	url: string;
	method: HttpMethod;
	headers: HttpHeaders;
	body?: object;
}

export interface ApiCallFinishedLog extends ApiCallStartLog {
	status: number;
	data: object;
}
