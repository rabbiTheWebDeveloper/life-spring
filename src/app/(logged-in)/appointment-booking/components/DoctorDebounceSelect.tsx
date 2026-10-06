"use client";

import { Avatar, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
import { getDoctorList } from "../../available-slot-report/actions/getDoctorList";

const { Option } = Select;

interface DoctorOption {
	label: string;
	value: string;
	avatar?: string;
}

const DoctorDebounceSelect: React.FC<{ value: any; setValue: any }> = ({ value, setValue }) => {
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState<DoctorOption[]>([]);
	const fetchRef = useRef(0);

	const router = useRouter();
	const searchParams = useSearchParams();

	// Debounced fetcher
	const debounceFetcher = useMemo(() => {
		const loadOptions = async (search: string) => {
			fetchRef.current += 1;
			const fetchId = fetchRef.current;
			setFetching(true);
			setOptions([]);

			try {
				const res = await getDoctorList(search);
				const doctors = Array.isArray(res?.data?.doctors) ? res.data.doctors : [];

				if (fetchId === fetchRef.current) {
					const mapped = doctors.map((doctor: any) => ({
						label: doctor.name,
						value: doctor.id,
						avatar: doctor.avatar || undefined,
					}));
					setOptions(mapped);
				}
			} catch (error) {
				console.error("Error fetching doctors:", error);
			} finally {
				setFetching(false);
			}
		};

		return debounce(loadOptions, 300);
	}, []);

	const handleChange = (newValue: any) => {
		setValue(newValue);

		const params = new URLSearchParams(searchParams.toString());
		params.set("type", "doctor");
		params.set("id", newValue?.value);

		router.push(`?${params.toString()}`);
	};

	return (
		<Select
			labelInValue
			showSearch
			filterOption={false}
			onSearch={debounceFetcher}
			notFoundContent={fetching ? <Spin size="small" /> : "No results found"}
			value={value}
			style={{ width: "100%" }}
			placeholder="Select doctor"
			size="large"
			className="min-w-[250px]"
			onChange={handleChange}
		>
			{options.map((option) => (
				<Option key={option.value} value={option.value}>
					<div style={{ display: "flex", alignItems: "center" }}>
						{option.avatar && <Avatar size="small" src={option.avatar} style={{ marginRight: 8 }} />}
						{option.label}
					</div>
				</Option>
			))}
		</Select>
	);
};

export default DoctorDebounceSelect;
