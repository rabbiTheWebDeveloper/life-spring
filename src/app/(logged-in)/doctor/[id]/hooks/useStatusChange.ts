'use client'
// @ts-ignore
import { useFormState } from "react-dom";
import { useState } from "react";
import { DefaultFormActionResult, defaultFormActionResult } from "@/app/components/types/Form";
import { ChangeStatusActionFn, FormErrors, FormValues } from "../types/Types";

const useStatusChange = (actionFn: ChangeStatusActionFn) => {
  const [result, action] = useFormState<DefaultFormActionResult, FormData>(actionFn, defaultFormActionResult);

  const [formValues, setFormValues] = useState<FormValues>({
		doctorId: 0,
		status: 0,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
		doctorId: false,
		status: false,
  });

  const form = {
    values: formValues,
    result,
    action,
    errors: formErrors,
  };

  return { form };
};

export default useStatusChange;
