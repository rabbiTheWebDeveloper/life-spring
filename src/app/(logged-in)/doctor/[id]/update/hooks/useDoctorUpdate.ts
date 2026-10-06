"use client";

import { defaultFormActionResult } from "@/app/components/types/Form";
// @ts-ignore
import { formatTimeFromDate } from "@/helper/DateHelper";
import { useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { AccountType, BankDetails, MFSType } from "../../../types/Type";
import updateDoctor from "../actions/UpdateDoctorAction";
import { FormState } from "../types/Types";

export default function useDoctorUpdate(doctor: any) {
	const {
		id,
		name,
		fee,
		experience,
		email,
		mobile,
		biography,
		specialty,
		profilePic,
		bmdcCode,
		bmdcExpiryDate,
		workingHours,
		workDays,
		bankDetails,
		degrees,
		isCoach,
		working_at,
		isEmergency,
		organizationId,
		timePeriod,
		signature,
		isInHouse,
		maxFee, // ✅ NEW
		minFee, // ✅ NEW
		branch, // ✅ NEW
		common_sl: commonSl, // ✅ NEW
		department_sl: departmentSl, // ✅ NEW
	} = doctor;

	const { accountTyp="", mfsType="", accountNo="", accountName="", bankName="", branchName="", routingNumber="" } = bankDetails||{};

	const [result, action] = useFormState<FormState, FormData>(updateDoctor, {
		id,
		...defaultFormActionResult,
	});

	const formatDate = (date: string | Date) => {
		const d = new Date(date);
		const month = `0${d.getMonth() + 1}`.slice(-2);
		const day = `0${d.getDate()}`.slice(-2);
		const year = d.getFullYear();
		return `${year}-${month}-${day}`;
	};

	const [workDaysState, setWorkDaysState] = useState<string[]>(workDays || []);
	const [workingHoursState, setWorkingHoursState] = useState({
		start: workingHours?.start ? new Date(`1970-01-01T${workingHours.start}`) : null,
		end: workingHours?.end ? new Date(`1970-01-01T${workingHours.end}`) : null,
	});

	const [attachments, setAttachments] = useState<any>([]);
	const [bankDetail, setBankDetail] = useState<any>({});

	const {
		register,
		reset,
		formState: { errors, isDirty, isValid },
	} = useForm({
		defaultValues: {
			name,
			experience,
			fee,
			maxFee, // ✅ NEW
			minFee, // ✅ NEW
			branch, // ✅ NEW
			commonSl, // ✅ NEW
			departmentSl, // ✅ NEW
			email,
			mobile,
			biography,
			specialty,
			profilePic,
			degrees,
			bmdcCode,
			bmdcExpiryDate: formatDate(bmdcExpiryDate),
			accountNo,
			accountName,
			bankName,
			branchName,
			isCoach,
			routingNumber,
			working_at,
			isEmergency,
			organizationId,
			timePeriod,
			signature,
			isInHouse,
		},
	});

	const handleDayChange = (day: string) => {
		setWorkDaysState((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
	};

	const changeAccountType = (t: AccountType) => {
		setBankDetail((c:any) => {
			const newCurrent = { ...c, accountType: t };
			if (t === AccountType.MFS) {
				newCurrent.mfsType = c.mfsType ?? MFSType.BKASH;
			}
			return newCurrent;
		});
	};

	const changeMfsType = (t: MFSType) => {
		setBankDetail((c:any) => ({ ...c, mfsType: t }));
	};

	const handleFileChangedocument = (e: any) => {
		const files = Array.from(e.target.files);
		if (files.some((file: any) => file.size > 2 * 1024 * 1024)) {
			return;
		}
		setAttachments((prev: any) => [...prev, ...files]);
	};

	const handleRemoveFile = (index: any) => {
		setAttachments((prev: any) => prev.filter((_: any, i: any) => i !== index));
	};

	const form = {
		register,
		errors,
		result,
		workingHours: {
			start: workingHoursState.start,
			end: workingHoursState.end,
			setStart: (date: Date | null) => setWorkingHoursState((prev) => ({ ...prev, start: date })),
			setEnd: (date: Date | null) => setWorkingHoursState((prev) => ({ ...prev, end: date })),
		},
		workDays: workDaysState,
		handleDayChange,
		action: (formData: FormData) => {
			const newBankDetail = { ...bankDetail };
			newBankDetail.accountNo = formData.get("accountNo") as string;
			newBankDetail.accountName = formData.get("accountName") as string;
			newBankDetail.branchName = formData.get("branchName") as string;
			newBankDetail.routingNumber = formData.get("routingNumber") as string;
			newBankDetail.bankName = formData.get("bankName") as string;

			formData.set("bankDetails", JSON.stringify(newBankDetail));
			formData.set("workDays", JSON.stringify(workDaysState));
			formData.set("start", workingHoursState.start ? formatTimeFromDate(workingHoursState.start) : "");
			formData.set("end", workingHoursState.end ? formatTimeFromDate(workingHoursState.end) : "");

			// ✅ You can also do custom validations or format `maxFee`, `minFee`, `branch` here if needed

			// Attach documents
			if (attachments?.length > 0) {
				for (let i = 0; i < attachments.length; i++) {
					formData.append("files", attachments[i]);
				}
			}

			action(formData);
		},
	};

	return {
		form,
		reset,
		bankDetail,
		changeMfsType,
		changeAccountType,
		handleFileChangedocument,
		handleRemoveFile,
		attachments,
		setAttachments,
	};
}
