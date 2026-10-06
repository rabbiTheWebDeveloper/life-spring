import { Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { updateDoctorBranch } from "../actions/updateBranch";

const { TextArea } = Input;
const { Option } = Select;

const BranchUpdateModal = ({ setShowModal, doctor, branchList, showModal }: any) => {
	console.log(doctor);
	const [loading, setLoading] = useState<any>(false);

	const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);

	useEffect(() => {
		if (doctor?.branches?.length) {
			const ids = doctor.branches.map((branch: any) => String(branch.id));
			setSelectedBranchIds(ids);
		}
	}, [doctor]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// setLoading(true);

		console.log(selectedBranchIds);

		const payload = {
			branchIds: selectedBranchIds.map((branch: any) => Number(branch)),
		};

		console.log(payload);

		// console.log("Submitting payment:", payload);

		const res = await updateDoctorBranch(doctor.id, payload);

		// console.log(res);

		if (res?.success) {
			handleCancel();
			setShowModal(false);
			// fetchData();
		} else {
			console.error(res);
		}
		// setLoading(false);
	};

	const handleCancel = () => {
		setShowModal(false);
		setSelectedBranchIds([]);
	};

	return (
		<Modal
			title="Discount"
			open={showModal}
			onOk={handleSubmit}
			onCancel={handleCancel}
			okText="Confirm"
			cancelText="Cancel"
			confirmLoading={loading}
			destroyOnClose={true}
		>
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-1 justify-start">
					<label className="text-gr font-medium text-sm">
						Branch <span className="text-red-500">*</span>
					</label>
					<Select
						mode="multiple"
						allowClear
						size="large"
						style={{ width: "100%" }}
						placeholder="Select branches"
						value={selectedBranchIds}
						onChange={(value) => {
							setSelectedBranchIds(value);
							document.getElementById("branchField")?.setAttribute("value", JSON.stringify(value));
						}}
						options={branchList}
					/>
				</div>
			</form>
		</Modal>
	);
};

export default BranchUpdateModal;
