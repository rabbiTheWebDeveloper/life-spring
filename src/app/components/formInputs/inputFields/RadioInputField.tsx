
import React from 'react';
import { Radio } from 'antd';
const RadioInputField = ({ options, selectedOption, handleOptionChange }:any) => {
	return (
		<div>
			<Radio.Group value={selectedOption} onChange={handleOptionChange} options={options}/>


		</div>
	);
};

export default RadioInputField;
