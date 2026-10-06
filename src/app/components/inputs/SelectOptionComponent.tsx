import React from "react";

const SelectInputComponent = ({ name, value, onChange, options = [], error,label,required=false }:any) => {
    return (
			<div className="flex flex-col">
				<label className="font-medium" htmlFor={name}>
					{label} {required && <span className="text-red-500">*</span>}
				</label>

				<select
					name={name}
					value={value}
					onChange={onChange}
					className={`mt-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						error ? "border-red-500" : "border-gray-300"
					} `}
				>
					{options.map((option: any, index: any) => (
						<option key={index} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
			</div>
		);
};

export default SelectInputComponent;
