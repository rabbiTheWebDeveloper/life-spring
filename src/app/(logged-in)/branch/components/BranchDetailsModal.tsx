import DropdownWithSearch from "@/app/components/formInputs/DropdownWithSearch";
import InputField from "@/app/components/formInputs/InputField";
import TextareaInputField from "@/app/components/formInputs/inputFields/TextareaInputField";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { getAllOrganizationList } from "../actions/GetAllOrganizationList";

export default function BranchDetailsModal({
	showModal,
	onModalClose,
	branchDetails,
	onFormSubmit,
	onInputChange,
	onSelectChange,
	isEditing,
}: any) {
	const [organizationList, setOrganizationList] = useState<any>(null);
	const [errors, setErrors] = useState<any>({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getAllOrganizationList();
				// console.log(res);
				if (res?.success) {
					setOrganizationList(res.data.data);
				} else {
					throw new Error(res?.message || "Failed to Fetch Organization List");
				}
			} catch (error: any) {
				console.error("Failed to Fetch Organization List");
			}
		};
		fetchData();
	}, []);

	const validateForm = () => {
		const newErrors: any = {};
		if (!branchDetails.name.trim()) {
			newErrors.name = true;
		}
		if (!branchDetails.location.trim()) {
			newErrors.location = true;
		}
		if (!branchDetails.organizationId) {
			newErrors.organizationId = "Selection of an organization is required.";
		}

		console.log(newErrors);
		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};
	return (
		<Modal
			title={`${isEditing ? "Update" : "Create"} Branch`}
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
						labelText="Branch Name"
						inputName="name"
						inputValue={branchDetails.name}
						inputPlaceholder="Enter branch name"
						onInputChange={onInputChange}
						error={errors.name}
					/>

					<TextareaInputField
						name="location"
						value={branchDetails.location}
						onChange={onInputChange}
						placeholder="eg. House # 55/2, Union Heights, Level # 6  West Panthapath"
						label="Location"
						required={true}
						error={errors.location}
					/>

					<DropdownWithSearch
						labelText="Organization"
						inputPlaceholder="Select organization"
						selectionValue={branchDetails.organizationId}
						selectionOptions={organizationList?.map((organization: any) => ({
							value: organization.id,
							label: organization.name,
						}))}
						onSelectChange={(value: any) => onSelectChange("organizationId", value)}
						isRequired={true}
						error={errors.organizationId}
						customErrorMessage={errors.organizationId}
					/>

					<div className="col-span-2 text-center mt-4">
						<button type="submit" className="bg-green-500 w-full px-2 py-1 text-white rounded-md">
							{isEditing ? "Update Branch" : "Create Branch"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
