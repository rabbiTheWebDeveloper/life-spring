'use client'
// @ts-ignore
import { useFormState } from "react-dom";
import { useState } from "react";
import { DefaultFormActionResult, defaultFormActionResult } from "@/app/components/types/Form";
import { CreateInvoiceActionFn, FormErrors, FormValues } from "../types/Types";

const useCreateInvoice = (actionFn: CreateInvoiceActionFn) => {
  const [result, action] = useFormState<DefaultFormActionResult, FormData>(actionFn, defaultFormActionResult);

  const [formValues, setFormValues] = useState<FormValues>({
		doctorId: 0,
    appointmentIds: [],

  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
		doctorId: false,
		appointmentIds: false,
  });

  const form = {
    values: formValues,
    result,
    action,
    errors: formErrors,
  };

  return { form };
};

export default useCreateInvoice;
