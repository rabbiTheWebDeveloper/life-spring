import Button from "@/app/components/buttons/Button";
import { message } from "antd";
import { useState } from "react";
import { getTokens } from "../../patient/action/AddPatient";

export default function ExportButton({
	status,
	search,
	startDate,
	endDate,
	paymentStatus,
	appointmentType,
	branch,
	doctor,
	criteria,
	appointmentId,
	phoneNumber,
	createdByType,
	executive,
	sortBy,
	orderBy,
	isMigrated,
	paymentFrom,
	paymentTo,
	transactionId,
	paymentMethod,
}: any) {
	const [loading, setLoading] = useState<boolean>(false);
	const handleDownload = async () => {
		// The export runs unpaginated on the backend, so it needs *a* window to
		// bound it -- but either window will do. Previously only the Appt. Date
		// range counted, so filtering by Payment From/To alone was refused.
		const hasAppointmentRange = Boolean(startDate && endDate);
		const hasPaymentRange = Boolean(paymentFrom && paymentTo);

		if (!hasAppointmentRange && !hasPaymentRange) {
			message.error("Please select an Appt. Date or a Payment date range");
			return;
		}
		setLoading(true);
		try {
			const token = await getTokens();

			const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			const url = `${baseUrl}v2/appointment/export-payments?format=xlsx${status ? `&status=${status}` : ""}${
				search ? `&search=${search}` : ""
			}${startDate && endDate ? `&from=${startDate}&to=${endDate}` : ""}${
				paymentStatus ? `&paymentStatus=${paymentStatus}` : ""
			}${appointmentType ? `&appointmentType=${appointmentType}` : ""}${branch ? `&branchId=${branch}` : ""}${
				doctor ? `&doctorId=${doctor}` : ""
			}${appointmentId ? `&id=${appointmentId}` : ""}${criteria ? `&criteria=${criteria}` : ""}${
				createdByType ? `&createdByType=${createdByType}` : ""
			}${executive ? `&createdById=${executive}` : ""}${
				sortBy && orderBy ? `&sort=${sortBy}:${orderBy}` : "&sort=createdAt:desc"
			}${isMigrated === "true" ? "&isMigrated=true" : isMigrated === "false" ? "&isMigrated=false" : ""}${
				paymentFrom && paymentTo ? `&paymentFrom=${paymentFrom}&paymentTo=${paymentTo}` : ""
			}${transactionId ? `&transactionId=${transactionId}` : ""}${
				paymentMethod ? `&paymentMethod=${paymentMethod}` : ""
			}`;

			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// console.log(url);
			// console.log(await response.json());
			let data: any;
			if (!response.ok) {
				// throw new Error("Download failed");
				data = await response.json();
				console.log(data);
				message.error(data?.message || "Error downloading file:");
				setLoading(false);
				return;
			}
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);

			// Open the file in a new tab or trigger direct download
			const a = document.createElement("a");
			a.href = downloadUrl;
			a.download = `payments_${Date.now()}.${"xlsx"}`;
			a.style.display = "none";
			document.body.appendChild(a);
			a.click();
			a.remove();

			URL.revokeObjectURL(downloadUrl);
			setLoading(false);
			message.success("Data exported successfully");
		} catch (error) {
			message.error("Error downloading file:");
			setLoading(false);
		}
	};
	return (
		<>
			<Button onButtonClick={handleDownload} tooltipTitle={"Export"}>
				{loading ? "...processing" : "Export"}
			</Button>
		</>
	);
}
