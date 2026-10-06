//@ts-ignore
//@ts-nocheck
import type { SelectProps } from "antd";
import { Avatar, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getDoctorList } from "../actions/getDoctorList";

export interface DebounceSelectProps<ValueType = any>
	extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
	fetchOptions: (search: string) => Promise<ValueType[]>;
	debounceTimeout?: number;
}

const ANY_DOCTOR = { label: "Select Doctor", value: "" };

function DebounceSelect<
	ValueType extends {
		key?: string;
		label: React.ReactNode;
		value: string | number;
		avatar?: string;
	} = any
>({ fetchOptions, debounceTimeout = 300, ...props }: DebounceSelectProps<ValueType>) {
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState<ValueType[]>([]);
	const fetchRef = useRef(0);

	const debounceFetcher = useMemo(() => {
		const loadOptions = (value: string) => {
			fetchRef.current += 1;
			const fetchId = fetchRef.current;
			setOptions([]);
			setFetching(true);

			fetchOptions(value).then((newOptions) => {
				if (fetchId !== fetchRef.current) {
					// for fetch callback order
					return;
				}

				setOptions(newOptions);
				setFetching(false);
			});
		};

		return debounce(loadOptions, debounceTimeout);
	}, [fetchOptions, debounceTimeout]);

	// A new fetcher means a new branch, so what is listed belongs to the old one.
	useEffect(() => {
		setOptions([]);
	}, [fetchOptions]);

	return (
		<Select
			labelInValue
			filterOption={false}
			onSearch={debounceFetcher}
			onDropdownVisibleChange={(open) => {
				if (open && options.length === 0) debounceFetcher("");
			}}
			notFoundContent={fetching ? <Spin size="small" /> : "No results found"}
			{...props}
			options={[ANY_DOCTOR, ...options]}
			optionRender={(option) => (
				<div style={{ display: "flex", alignItems: "center" }}>
					{option.data.avatar && <Avatar src={option.data.avatar} style={{ marginRight: 8 }} />}
					{option.label}
				</div>
			)}
		/>
	);
}

// Usage of DebounceSelect
interface UserValue {
	label: string;
	value: string;
	avatar?: string;
}

async function fetchUserList(username: string, branchId?: number): Promise<any[]> {
	console.log("Fetching user:", username);

	return getDoctorList(username, branchId)
		.then((res) => {
			const doctors = Array.isArray(res?.data?.doctors) ? res.data.doctors : [];

			return doctors.map((doctor: any) => ({
				label: doctor.name,
				value: doctor.id,
			}));
		})
		.catch((err) => {
			console.error("Error fetching doctor list:", err);
			return [];
		});
}

const DoctorListSearch: React.FC = ({ value, setValue, branchId }: any) => {
	const fetchOptions = useMemo(() => (username: string) => fetchUserList(username, branchId), [branchId]);

	return (
		<DebounceSelect
			size="large"
			mode="single"
			value={value}
			placeholder="Select doctor"
			fetchOptions={fetchOptions}
			style={{ width: "100%" }}
			onChange={(newValue) => {
				setValue(newValue?.value === "" ? "" : newValue);
			}}
			showSearch
			className="min-w-[250px]"
		/>
	);
};

export default DoctorListSearch;
