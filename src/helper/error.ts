export const catchErrorMessage = (error: any) => {
	let errorMessage = "Something went wrong. Please try again.";

	switch (error?.cause?.code) {
		case "CERT_HAS_EXPIRED":
			errorMessage = "The server's security certificate has expired. Please contact support.";
			break;

		case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
			errorMessage = "The server's SSL certificate could not be verified.";
			break;

		case "ECONNREFUSED":
			errorMessage = "The server refused the connection. Please try again later.";
			break;

		case "ECONNRESET":
			errorMessage = "The connection was reset. Please try again.";
			break;

		case "ENOTFOUND":
			errorMessage = "Unable to reach the server. Please check your internet connection.";
			break;

		case "ETIMEDOUT":
			errorMessage = "The request timed out. Please try again.";
			break;

		case "EAI_AGAIN":
			errorMessage = "Temporary DNS resolution error. Please try again.";
			break;

		default:
			if (!error.cause?.code && error.message?.includes("fetch failed")) {
				// only apply this if no specific code is available
				errorMessage = "Network request failed. Please check your internet connection.";
			} else if (error.message) {
				errorMessage = error.message;
			}
			break;
	}

	return errorMessage;
};
