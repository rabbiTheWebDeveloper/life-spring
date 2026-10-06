import { ApiCallFinishedLog, ApiCallStartLog } from "@/api/Types";
import config from "@/types/Config";

const ld = (title: string, o: object) => {
	console.log(title);
	console.dir(o, { depth: null, colors: true });
};

function log(s: any) {
	if (config.isInProduction()) return;

}

function error(e: any) {
	if (config.isInProduction()) return;

	console.error(e);
}

function convertFormData(body: FormData) {
	const o: object = {};
	body.forEach((v, k) => ((o as any)[k] = body.get(k)));
	return o;
}

function apiCallStart(l: ApiCallStartLog) {
	if (config.isInProduction()) return;

	l.body = !l.body ? undefined : l.body instanceof FormData ? convertFormData(l.body) : l.body;

	ld("API call start:", l);
}

function apiFinishedError(e: ApiCallFinishedLog) {
	if (config.isInProduction()) return;

	ld("API Call finished with error:", e);
}

function apiFinishedSuccess(l: ApiCallFinishedLog) {
	if (config.isInProduction()) return;

	ld("API Call finished with success:", l);
}

const logger = {
	log,
	error,
	apiFinishedSuccess,
	apiFinishedError,
	apiCallStart,
};

export default logger;
