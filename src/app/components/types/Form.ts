export interface DefaultFormActionResult {
	error?: string;
	success?: string;
}

export const defaultFormActionResult: DefaultFormActionResult = {
	error: undefined,
	success: undefined,
};


export interface DefaultActionResult extends DefaultFormActionResult {}
export const defaultActionResult: DefaultActionResult = defaultFormActionResult;
