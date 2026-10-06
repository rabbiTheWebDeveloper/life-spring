import { Modal } from "antd";
import { IoTrashBin } from "react-icons/io5";

export default function GatewayDeleteModal({ showModal, onCancel, confirmDeletation, gateway }: any) {
	return (
		<>
			<Modal open={showModal} onCancel={onCancel} okText="Delete" footer={null}>
				<div className="flex flex-col items-center gap-1">
					<IoTrashBin color="#b91c1c" size="80px" />
					<h1 className="text-2xl font-semibold ">Delete - {gateway.title} </h1>
					<p className="text-sm">Are you sure you want to delete this med?</p>
					<div className="flex gap-2 mt-4">
						<button
							className="px-2 py-1 border border-1 border-primary-400 text-primary-400 rounded-md"
							onClick={(e: any) => {
								e.preventDefault();
								confirmDeletation(gateway.id);
							}}
						>
							Yes, Delete
						</button>
						<button className="px-2 py-1 bg-primary-400 text-white rounded-md" onClick={onCancel}>
							No, Cancel
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}
