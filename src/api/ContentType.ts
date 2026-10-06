import { HttpHeaders } from "./Types";

const isFile = (data: any) => {
	if (typeof data !== "object") return false;

	const ob = data as object;
	if (ob) return "size" in ob && "name" in ob && "lastModified" in ob;
};

const hasFile = (body: object) => {
	return Object.values(body).reduce((prev, curr) => prev || isFile(curr), false);
};

export const ContentType = {
	key: "Content-type",
	json: "application/json; charset=UTF-8",
	form: "multipart/form-data; charset=UTF-8",
	isForm: (headers: HttpHeaders) => ContentType.key in headers && headers[ContentType.key] === ContentType.form,
	isMultipart: (body?: object) => {
		if (!body) return false;

		if (body instanceof FormData) return true;

		return hasFile(body);
	},
	set: (headers: HttpHeaders, body?: object) => {
		const newHeaders = { ...headers };
		// if (!(ContentType.key in headers)) {
		//   newHeaders[ContentType.key] = ContentType.isMultipart(body) ? ContentType.form : ContentType.json;
		// }
		if (!(ContentType.key in headers) && !ContentType.isMultipart(body)) {
			newHeaders[ContentType.key] = ContentType.json;
		}
		return newHeaders;
	},
};

export const shouldBeFormData = (body: object, headers: HttpHeaders) => {
	if (body instanceof FormData) return true;
	if (headers && ContentType.isForm(headers)) return true;
	return hasFile(body);
};
