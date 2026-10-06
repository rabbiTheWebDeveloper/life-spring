import React from "react";

const WrapperComponent = ({ className, children }: any) => {
	return <div className={className}>{children}</div>;
};

export default WrapperComponent;
