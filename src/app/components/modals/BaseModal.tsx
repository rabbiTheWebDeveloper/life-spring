import { Modal } from "antd";

export default function BaseModal({
	children,
	showModal,
	modalTitle,
	onCancelModal,
	modalWidth = 500,
	modalMaskClosable = true,
	modalDestroyOnClose = true,
}: any) {
	return (
		<Modal
			title={modalTitle}
			open={showModal}
			onCancel={onCancelModal}
			okText="Create"
			footer={null}
			width={modalWidth}
			maskClosable={modalMaskClosable}
			destroyOnClose={modalDestroyOnClose}
			centered
		>
			{children}
		</Modal>
	);
}
