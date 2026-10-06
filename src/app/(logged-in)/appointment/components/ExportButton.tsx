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
	packageId,
}: any) {
	const [loading, setLoading] = useState<boolean>(false);
	const handleDownload = async () => {
		if (!startDate && !endDate) {
			message.error("Please select date range");
			return;
		}
		setLoading(true);
		try {
			const token = await getTokens();

			const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			const url = `${baseUrl}v2/appointment/export?format=xlsx${status ? `&status=${status}` : ""}${
				search ? `&search=${search}` : ""
			}${startDate && endDate ? `&from=${startDate}&to=${endDate}` : ""}${
				paymentStatus ? `&paymentStatus=${paymentStatus}` : ""
			}${appointmentType ? `&appointmentType=${appointmentType}` : ""}${branch ? `&branchId=${branch}` : ""}${
				doctor ? `&doctorId=${doctor}` : ""
			}${appointmentId ? `&id=${appointmentId}` : ""}${criteria ? `&criteria=${criteria}` : ""}${
				createdByType ? `&createdByType=${createdByType}` : ""
			}${executive ? `&createdById=${executive}` : ""}${
				sortBy && orderBy ? `&sort=${sortBy}:${orderBy}` : "&sort=createdAt:desc"
			}${
				// Must match GetAppointmentList: an unset filter sends nothing at all.
				// Treating "" as false made the export ask for isMigrated=false and
				// silently drop every migrated appointment — a list of 408 exported 2.
				isMigrated === "true" ? "&isMigrated=true" : isMigrated === "false" ? "&isMigrated=false" : ""
			}${packageId ? `&packageId=${packageId}` : ""}`;

			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response);
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
			a.download = `appointments_${Date.now()}.${"xlsx"}`;
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
