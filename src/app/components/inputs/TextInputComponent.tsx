import React from "react";

const TextInputComponent = ({ name, value, onChange, placeholder, error,label,required=false }:any) => {
    return (
			<div className="flex flex-col">
				<label className="font-medium" htmlFor={name}>
					{label} {required && <span className="text-red-500">*</span>}
				</label>

				<input
					type="text"
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={`mt-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						error ? "border-red-500" : "border-gray-300"
					} `}
				/>
				{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
			</div>
		);
};

export default TextInputComponent;
