"use client";

import { Avatar, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { useMemo, useRef, useState } from "react";
import { getDoctorList } from "@/app/(logged-in)/available-slot-report/actions/getDoctorList";

const { Option } = Select;

interface DoctorOption {
	label: string;
	value: string;
	avatar?: string;
}

const DoctorSwitchSelect: React.FC<{ onDoctorChange: (doctorId: string) => void }> = ({ onDoctorChange }) => {
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState<DoctorOption[]>([]);
	const [value, setValue] = useState<any>(null);
	const fetchRef = useRef(0);

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
		onDoctorChange(newValue?.value);
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
			placeholder="Search and select a doctor"
			size="large"
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

export default DoctorSwitchSelect;
