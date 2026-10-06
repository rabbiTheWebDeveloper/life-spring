'use client'

// @ts-ignore
import { useFormState } from "react-dom";
import { useState } from "react";
import { DefaultFormActionResult, defaultFormActionResult } from "@/app/components/types/Form";
import { CreateDisbursementActionFn, FormErrors, FormValues } from "../types/Types";

const useCreateDisbursement = (actionFn: CreateDisbursementActionFn) => {
  const [result, action] = useFormState<DefaultFormActionResult, FormData>(actionFn, defaultFormActionResult);

  const [formValues, setFormValues] = useState<FormValues>({
		invoiceId: 0,
    paymentMethod: "",
		refNo: "",
		attachment: null,

  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
		invoiceId: false,
		paymentMethod: false,
		refNo: false,
		attachment: false,

  });

  const form = {
    values: formValues,
    result,
    action,
    errors: formErrors,
  };

  return { form };
};

export default useCreateDisbursement;
