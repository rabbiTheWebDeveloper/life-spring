"use client";
// @ts-ignore
import { useFormState } from "react-dom";
import { useState } from "react";
import { DefaultFormActionResult, defaultFormActionResult } from "@/app/components/types/Form";
import { CreateDoctorActionFn, FormErrors, FormValues } from "../types/Types";

const useCreateDoctor = (actionFn: CreateDoctorActionFn) => {
	const [result, action] = useFormState<DefaultFormActionResult, FormData>(actionFn, defaultFormActionResult);

	const [formValues, setFormValues] = useState<FormValues>({
		name: "",
		userName: "",
		bmdcCode: "",
		password: "",
		email: "",
		mobile: "",
		experience: 0,
		degrees: "",
		workDays: [],
		fee: 0,
		biography: "",
		start: "",
		end: "",
		specialtyId: 0,
		isCoach: "",
	});
	const [formErrors, setFormErrors] = useState<FormErrors>({
		name: false,
		userName: false,
		bmdcCode: false,
		password: false,
		mobile: false,
		experience: false,
		degrees: false,
		workDays: false,
		email: false,
		fee: false,
		biography: false,
		start: false,
		end: false,
		specialtyId: false,
		isCoach: false,
	});

	const form = {
		values: formValues,
		result,
		action,
		errors: formErrors,
	};

	return { form };
};

export default useCreateDoctor;
