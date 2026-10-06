"use client";

import { Input, type InputRef } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface Props {
	url: string;
	prop: string;
	placeholder?: string;
}

export default function SearchFromList({ url, prop, placeholder = "Search" }: Props) {
	const [search, setSearch] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();
	const inputRef = useRef<InputRef>(null);
	const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		// Never overwrite what is being typed: the URL trails the input by the debounce,
		// and echoing it back would swallow the keystrokes typed in between.
		if (inputRef.current?.input === document.activeElement) return;
		setSearch(searchParams.get(prop) ?? "");
	}, [searchParams, prop]);

	useEffect(() => () => clearTimeout(debounce.current), []);

	// `url` carries the page the caller is sitting on. A new search has to start at page
	// 0, otherwise a narrowed result set leaves the user staring at an empty page 3.
	const pushURL = (query: string) => {
		clearTimeout(debounce.current);

		const [path, existing = ""] = url.split("?");
		const params = new URLSearchParams(existing);
		if (query) params.set(prop, query);
		else params.delete(prop);
		params.set("page", "0");

		router.push(`${path}?${params.toString()}`, { scroll: false });
	};

	const handleChange = (event: FormEvent<HTMLInputElement>) => {
		const query = event.currentTarget.value;
		setSearch(query);
		clearTimeout(debounce.current);
		debounce.current = setTimeout(() => pushURL(query), 300);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		pushURL(search);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			pushURL(event.currentTarget.value);
		}
	};

	const handleReset = () => {
		setSearch("");
		pushURL("");
	};

	return (
		<form className="w-[200px]" onSubmit={handleSubmit}>
			<Input
				ref={inputRef}
				type="text"
				size="middle"
				placeholder={placeholder}
				prefix={<AiOutlineSearch style={{ color: "rgba(0,0,0,.25)" }} />}
				value={search}
				suffix={
					search && (
						<button
							type="button"
							onClick={handleReset}
							className="absolute right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
							aria-label="Reset search"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					)
				}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
		</form>
	);
}
