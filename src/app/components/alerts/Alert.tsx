"use client";

import { Duration, convertDurationToMillisecond } from "@/helper/DateHelper";
import { useEffect, useState } from "react";

interface Props {
	image: string;
	title: string;
	className: string;
	autoHide?: boolean;
	time?: Duration<number>;
}

export default function Alert({ image, title, className, autoHide, time }: Props) {
	const [show, setShow] = useState(true);

	useEffect(() => {
		if (!autoHide) return;

		const hideTime = time ?? { second: 5 };

		const timeoutId = setTimeout(() => {
			setShow(false);
		}, convertDurationToMillisecond(hideTime));

		return () => clearTimeout(timeoutId);
	}, [autoHide, time]);

	if (!show) return null;

	return (
		<div className={`flex items-start mb-4 w-full rounded-lg ${className} px-[16px] py-[6px]`}>
			{/* <Image src={image} height={22} width={22} alt="" className="mr-3 mt-1.5" /> */}
			<div className="py-[6px] flex flex-col">
				<p className="text-[13px] font-normal leading-5">{title}</p>
			</div>
		</div>
	);
}
