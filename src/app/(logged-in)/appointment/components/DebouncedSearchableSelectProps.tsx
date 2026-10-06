"use client";

import { Avatar, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
import { getDoctorList } from "../../available-slot-report/actions/getDoctorList";

const { Option } = Select;

interface DoctorDebounceSelectProps {
	url: string;
	prop: string;
	width?: number;
}

interface DoctorOption {
	label: string;
	value: string;
	avatar?: string;
}

const DoctorDebounceSelect: React.FC<DoctorDebounceSelectProps> = ({ url, prop, width = 180 }) => {
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState<DoctorOption[]>([]);
	const [value, setValue] = useState<any>(null);
	const pathname = usePathname();

	const fetchRef = useRef(0);
	const router = useRouter();
	const searchParams = useSearchParams();

	// ✅ Debounced API fetch
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

	// ✅ Update URL when doctor selected
	const handleChange = (newValue: any) => {
		setValue(newValue);

		const params = new URLSearchParams(searchParams.toString());

		if (newValue?.value) {
			params.set(prop, String(newValue.value));
		} else {
			params.delete(prop);
		}

		const finalUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

		router.push(finalUrl, { scroll: false });
	};

	return (
		<Select
			labelInValue
			showSearch
			filterOption={false}
			onSearch={debounceFetcher}
			notFoundContent={fetching ? <Spin size="small" /> : "No doctor found"}
			value={value}
			style={{ width }}
			placeholder="Search doctor"
			size="middle"
			className="min-w-[180px]"
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

export default DoctorDebounceSelect;
