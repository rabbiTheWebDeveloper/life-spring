import React from "react";

const InputGridWrapper = ({ children, cols = 1, gap = 4 }: any) => {
	return (
		<div
			className={`grid grid-cols-1 md:grid-cols-${cols} gap-${gap}`}
		>
			{children}
		</div>
	);
};

export default InputGridWrapper;
