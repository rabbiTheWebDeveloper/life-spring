"use client";

import { Avatar, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { useMemo, useRef, useState } from "react";
import { getDoctorList } from "../../available-slot-report/actions/getDoctorList";

const { Option } = Select;

interface DoctorDebounceSearchProps {
	selectedDoctor: DoctorOption | null;
	setSelectedDoctor: (doctor: DoctorOption | null) => void;
}

export interface DoctorOption {
	label: string;
	value: string;
	avatar?: string;
	raw?: any; // full doctor object if you need later
}

const DoctorDebounceSearch: React.FC<DoctorDebounceSearchProps> = ({ selectedDoctor, setSelectedDoctor }) => {
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState<DoctorOption[]>([]);
	const fetchRef = useRef(0);

	// ✅ Debounced doctor search
	const debounceFetcher = useMemo(() => {
		const loadOptions = async (search: string) => {
			if (!search || search.length < 2) return;

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
						raw: doctor, // store full object
					}));

					setOptions(mapped);
				}
			} catch (error) {
				console.error("Error fetching doctors:", error);
			} finally {
				setFetching(false);
			}
		};

		return debounce(loadOptions, 400);
	}, []);

	// ✅ Only update parent state
	const handleChange = (newValue: any) => {
		if (!newValue) {
			setSelectedDoctor(null);
			return;
		}

		const selected = options.find((opt) => opt.value === newValue.value);

		setSelectedDoctor(selected || null);
	};

	return (
		<Select
			labelInValue
			showSearch
			filterOption={false}
			onSearch={debounceFetcher}
			notFoundContent={fetching ? <Spin size="small" /> : "No doctor found"}
			value={selectedDoctor}
			placeholder="Search doctor"
			size="middle"
			style={{ width: "100%", marginBottom: 16 }}
			onChange={handleChange}
			allowClear
		>
			{options.map((option) => (
				<Option key={option.value} value={option.value}>
					<div className="flex items-center gap-2">
						{option.avatar && <Avatar size="small" src={option.avatar} />}
						<span>{option.label}</span>
					</div>
				</Option>
			))}
		</Select>
	);
};

export default DoctorDebounceSearch;
