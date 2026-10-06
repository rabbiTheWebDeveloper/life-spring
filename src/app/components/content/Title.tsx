import React from "react";

const TitleComponent = ({ children, className }: any) => {
	return <h2 className={`text-lg font-semibold text-primary ${className}`}>{children}</h2>;
};

export default TitleComponent;
