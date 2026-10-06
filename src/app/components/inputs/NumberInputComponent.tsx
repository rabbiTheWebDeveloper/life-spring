import React from "react";

const NumberInputComponent = ({ name, value, onChange, placeholder, min, max,maxLength, error,label,required=false }:any) => {
    const handleNumberChange = (e:any) => {
        const newValue = e.target.value;
        if (newValue === "" || /^\d+$/.test(newValue)) {
            onChange(e);
        }
    };

    return (
			<div className="flex flex-col">
				<label className="font-medium" htmlFor={name}>
					{label} {required && <span className="text-red-500">*</span>}
				</label>

				<input
					type="number"
					autoComplete={"off"}
					name={name}
					value={value}
					onChange={handleNumberChange}
					placeholder={placeholder}
					min={min}
					max={max}
					maxLength={maxLength}
					className={`mt-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						error ? "border-red-500" : "border-gray-300"
					} `}
				/>
				{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
			</div>
		);
};

export default NumberInputComponent;
