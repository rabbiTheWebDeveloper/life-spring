import InputField from "@/app/components/formInputs/InputField";
import { Checkbox, Modal } from "antd";
import { useState } from "react";

export default function PaymentMethodModal({
	showModal,
	onModalClose,
	paymentMethod,
	onInputChange,
	onActiveChange,
	onFormSubmit,
	isEditing,
}: any) {
	const [errors, setErrors] = useState<any>({});

	const validateForm = () => {
		const newErrors: any = {};
		if (!paymentMethod.name.trim()) {
			newErrors.name = true;
		}
		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	return (
		<Modal
			title={`${isEditing ? "Update" : "Create"} Payment Method`}
			open={showModal}
			onCancel={() => {
				onModalClose();
				setErrors({});
			}}
			okText="Create"
			footer={null}
			maskClosable={true}
		>
			<div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (validateForm()) {
							onFormSubmit(e);
						}
					}}
					className="flex flex-col gap-2"
				>
					<InputField
						labelText="Name"
						inputName="name"
						inputValue={paymentMethod.name}
						inputPlaceholder="Enter payment method name"
						onInputChange={onInputChange}
						error={errors.name}
					/>

					<InputField
						labelText="Sort Order"
						inputName="sortOrder"
						inputType="number"
						isRequired={false}
						inputValue={paymentMethod.sortOrder}
						inputPlaceholder="Sorting order"
						onInputChange={onInputChange}
					/>

					<Checkbox checked={paymentMethod.isActive} onChange={(e) => onActiveChange(e.target.checked)}>
						Active
					</Checkbox>

					<div className="col-span-2 text-center mt-4">
						<button type="submit" className="bg-green-500 w-full px-2 py-1 text-white rounded-md">
							{isEditing ? "Update Payment Method" : "Create Payment Method"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
