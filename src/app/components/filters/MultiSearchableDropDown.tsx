"use client";
import { Select } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MultiSearchableDropDown = ({
	selectedValue = "",
	selectionOption,
	placeholder = "Placeholder Here",
	prop,
	url,
	width = 220,
}: any) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectionValue, setSelectionValue] = useState<string[]>(selectedValue ? selectedValue.split(",") : []);

	useEffect(() => {
		const query = searchParams.get(prop);
		if (query) {
			setSelectionValue(query.split(","));
		} else if (selectedValue) {
			setSelectionValue(selectedValue.split(","));
		} else {
			setSelectionValue([]);
		}
	}, [searchParams, prop, selectedValue]);

	const updateURL = (values: string[]) => {
		const query = values.join(",");
		const newURL = query ? `${url}&${prop}=${query}` : url;
		router.push(newURL, { scroll: false });
	};

	function handleSelect(values: string[]) {
		setSelectionValue(values);
		updateURL(values);
	}

	return (
		<Select
			mode="multiple"
			style={{ width: `${width}px` }}
			size="middle"
			showSearch
			placeholder={placeholder}
			onChange={handleSelect}
			value={selectionValue}
			maxTagCount="responsive"
			filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
			options={selectionOption}
		/>
	);
};

export default MultiSearchableDropDown;
