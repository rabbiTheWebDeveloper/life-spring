import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ButtonAdd } from "../types/ButtonAdd";

const AddButton = ({ text, link }: ButtonAdd) => {
	return (
		<Link
			href={link}
			className="flex justify-between items-center py-1.5 px-4 min-w-fit rounded border gap-3 bg-primary"
		>
			<Image src="/add.svg" height={17} width={17} alt="add" />
			<h2 className="text-white font-semibold">{text}</h2>
		</Link>
	);
};

export default AddButton;
