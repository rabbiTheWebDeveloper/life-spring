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
}: any) {
	const [loading, setLoading] = useState<boolean>(false);
	const handleDownload = async () => {
		// The daily-patient PDF is a per-doctor, per-day report — the backend puts the
		// doctor's details in the header and rejects the request without both. Tell the
		// user that up front instead of firing a request that always 400s.
		if (!doctor || !startDate) {
			message.warning("Please select a doctor and a date before exporting.");
			return;
		}

		setLoading(true);
		try {
			const token = await getTokens();

			const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			const url = `${baseUrl}v2/appointment/generate-daily-patient-pdf?format=pdf${status ? `&status=${status}` : ""}${
				search ? `&search=${search}` : ""
			}${startDate && endDate ? `&date=${startDate}` : ""}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ""}${
				appointmentType ? `&appointmentType=${appointmentType}` : ""
			}${branch ? `&branchId=${branch}` : ""}${doctor ? `&doctorId=${doctor}` : ""}${
				appointmentId ? `&id=${appointmentId}` : ""
			}${criteria ? `&criteria=${criteria}` : ""}${createdByType ? `&createdByType=${createdByType}` : ""}${
				executive ? `&createdById=${executive}` : ""
			}${sortBy && orderBy ? `&sort=${sortBy}:${orderBy}` : "&sort=createdAt:desc"}`;

			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				// Surface the backend's reason instead of a generic failure — the previous
				// message hid errors like "Doctor ID is required".
				const reason = await response
					.json()
					.then((body: any) => body?.message)
					.catch(() => null);
				throw new Error(reason || "Download failed");
			}

			const result = await response.json();

			if (result?.data?.pdfUrl) {
				const link = document.createElement("a");
				link.href = result.data.pdfUrl;
				link.download = `daily-patient-${Date.now()}.pdf`;
				link.target = "_blank";
				link.style.display = "none";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				message.success("PDF downloaded successfully");
			} else {
				throw new Error("No PDF URL found in response");
			}
		} catch (error: any) {
			console.error("Error downloading file:", error);
			message.error(error?.message || "Failed to download PDF");
		} finally {
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
