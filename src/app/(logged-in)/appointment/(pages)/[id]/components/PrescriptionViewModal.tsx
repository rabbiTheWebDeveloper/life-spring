import { Modal, Tooltip, Spin, Button } from "antd";
import React, { useState, useEffect } from "react";
import { FaFileDownload } from "react-icons/fa";

export default function PrescriptionViewModal({
																								isModalVisible,
																								setIsModalVisible,
																								appointment,
																							}: any) {
	const [pdfUrl, setPdfUrl] = useState("");
	// const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		if (appointment?.prescriptionLink) {
			// setLoading(true);
			setHasError(false);
			const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
				appointment.prescriptionLink
			)}&embedded=true`;
			setPdfUrl(googleViewerUrl);
		}
	}, [appointment]);

	const handleIframeError = () => {
		setHasError(true);
		// setLoading(false);
	};

	const handleIframeLoad = () => {
		// setLoading(false);
	};

	return (
		<Modal
			title="Prescription View"
			open={isModalVisible}
			width="70%"
			onCancel={() => setIsModalVisible(false)}
			footer={null}
		>
			<div>
				<div className="flex items-center mb-4 justify-end">
					<Tooltip title="Download Prescription" color="#2db7f5">
						<div className="bg-primary flex items-center justify-center rounded-md px-2 py-2 cursor-pointer text-white">
							<a
								href={appointment?.prescriptionLink}
								download
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaFileDownload size={18} />
							</a>
						</div>
					</Tooltip>
				</div>

				{/*{loading && (*/}
				{/*	<div className="flex items-center justify-center">*/}
				{/*		<Spin size="large" />*/}
				{/*	</div>*/}
				{/*)}*/}

				{!hasError && (
					<iframe
						src={pdfUrl}
						title="PDF Viewer"
						width="100%"
						height="600px"
						// style={{ border: "none", display: loading ? "none" : "block" }}
						onLoad={handleIframeLoad}
						onError={handleIframeError}
					/>
				)}

				{hasError && (
					<div className="text-center p-4">
						<p className="mb-4">
							Could not display PDF. Please download it instead.
						</p>
						<Button
							type="primary"
							href={appointment?.prescriptionLink}
							download
							icon={<FaFileDownload />}
						>
							Download Prescription
						</Button>
					</div>
				)}
			</div>
		</Modal>
	);
}
