'use client'
// @ts-ignore
import { useFormState } from "react-dom";
import { useState } from "react";
import { FormErrors, FormKey, FormValues, LoginActionFn } from "./types/Types";
import { DefaultFormActionResult, defaultFormActionResult } from "@/app/components/types/Form";

const useLogin = (actionFn: LoginActionFn) => {
	const [result, action] = useFormState<DefaultFormActionResult, FormData>(actionFn, defaultFormActionResult);

	const [formValues, setFormValues] = useState<FormValues>({
		email: "",
		password: "",
	});
	const [formErrors, setFormErrors] = useState<FormErrors>({
		email: false,
		password: false,
	});

	const form = {
		values: formValues,
		update: (k: FormKey, v: string) => {
			if (k === "email" && /[^A-Za-z0-9\.\+@]/.test(v)) return;

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
		action,
		canSubmit: formValues.email !== "" && formValues.password !== "",
		errors: formErrors,
	};

	return { form };
};

export default useLogin;
