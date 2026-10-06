//@ts-ignore
"use client";

import { getUserList } from "@/app/(logged-in)/user/actions/GetUserList";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
	url: string;
	prop: string;
	placeholder?: string;
	isEditing?: boolean;
	origValue?: any;
}

export default function UserSearchFilter({
	url,
	prop,
	placeholder = "Search Executive",
	isEditing = false,
	origValue = null,
}: Props) {
	const [search, setSearch] = useState("");
	const [value, setValue] = useState<any>(origValue);
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState<any[]>([]);
	const fetchRef = useRef(0);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const query = searchParams.get(prop);
		setSearch(query || "");
		setValue(query || null);
	}, [searchParams, prop]);

	const updateURL = (query: string | null) => {
		const newURL = query ? `${url}&${prop}=${query}` : url;
		router.push(newURL, { scroll: false });
	};

	const fetchPatients = async (search: string) => {
		try {
			const response: any = await getUserList(0, search);
			console.log(response);
			return (
				response?.data?.data.map((data: any) => ({
					label: `${data.firstName} ${data.lastName}`,
					value: String(data.id),
				})) || []
			);
		} catch (error) {
			console.error("Error fetching patients:", error);
			return [];
		}
	};

	const debounceFetcher = useMemo(() => {
		const loadOptions = (value: string) => {
			fetchRef.current += 1;
			const fetchId = fetchRef.current;
			setFetching(true);
			setOptions([]);

			fetchPatients(value).then((newOptions: any) => {
				if (fetchId !== fetchRef.current) return;
				setOptions(newOptions);
				setFetching(false);
			});
		};

		return debounce(loadOptions, 800);
	}, [search]);

	// Handle select change
	const handleChange = (newValue: any) => {
		setValue(newValue);
		updateURL(newValue);
	};

	return (
		<div className="w-[200px]">
			<Select
				showSearch
				size="middle"
				value={value}
				placeholder={placeholder}
				filterOption={false}
				onSearch={debounceFetcher}
				notFoundContent={fetching ? <Spin size="small" /> : null}
				options={[{ value: "", label: "Search Executive", disabled: true }, ...options]}
				onChange={handleChange}
				style={{ width: "100%" }}
				disabled={isEditing}
			/>
		</div>
	);
}
