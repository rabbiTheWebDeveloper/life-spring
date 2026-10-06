"use client";
import { Select } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchableDropDown = ({
	selectedValue = "",
	selectionOption,
	placeholder = "Placeholder Here",
	prop,
	url,
	width = 180,
	onSearch,
	// Let the dropdown panel size itself to its longest option instead of being
	// clamped to the select's width. The closed select is untouched. Off by
	// default so every existing filter keeps the look it has today.
	autoWidthDropdown = false,
}: any) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectionValue, setSelectionValue] = useState(selectedValue);

	useEffect(() => {
		const query = searchParams.get(prop);
		if (query) {
			setSelectionValue(query);
		} else if (!query && selectedValue) {
			setSelectionValue(selectedValue);
		} else {
			setSelectionValue("");
		}
	}, [searchParams, prop, selectedValue]);

	const updateURL = (query: string) => {
		const newURL = query ? `${url}&${prop}=${query}` : url;
		router.push(newURL, { scroll: false });
	};

	function handleSelect(value: string) {
		setSelectionValue(value);
		updateURL(value);
	}

	return (
		<Select
			style={{ width: `${width}px` }}
			size="middle"
			showSearch
			placeholder={placeholder}
			onChange={handleSelect}
			value={String(selectionValue)}
			popupMatchSelectWidth={!autoWidthDropdown}
			filterOption={(input: any, option: any) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
			options={selectionOption}
			onSearch={(value) => {
				if (typeof onSearch === "function") {
					onSearch(value);
				}
			}}
		/>
	);
};

export default SearchableDropDown;
