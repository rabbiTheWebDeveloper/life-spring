"use client";
// @ts-ignore
import { useFormState } from "react-dom";
import { useState } from "react";
import { FormErrors, FormKey, FormValues, ResetActionFn } from "./types/Types";
import { DefaultFormActionResult, defaultFormActionResult } from "@/app/components/types/Form";
import { useSearchParams } from "next/navigation";

const useResetPassword = (actionFn: ResetActionFn) => {
	const searchParams = useSearchParams();

	const [result, action] = useFormState<DefaultFormActionResult, FormData>(actionFn, defaultFormActionResult);

	const [formValues, setFormValues] = useState<FormValues>({
		password: "",
		confirm: "",
	});
	const [formErrors, setFormErrors] = useState<FormErrors>({
		password: false,
		confirm: false,
	});

	const form = {
		values: formValues,
		update: (k: FormKey, v: string) => {
			setFormValues((current) => {
				const newCurrent = { ...current };
				newCurrent[k] = v;
				return newCurrent;
			});

			setFormErrors((current) => {
				const newCurrent = { ...current };
				newCurrent[k] = v !== "";
				return newCurrent;
			});
		},
		result,
		action: (payload: FormData) => {
			payload.append("token", searchParams.get("token")!);
			action(payload);
		},
		canSubmit: formValues.password !== "" && formValues.password == formValues.confirm,
		errors: formErrors,
	};

	return { form };
};

export default useResetPassword;
