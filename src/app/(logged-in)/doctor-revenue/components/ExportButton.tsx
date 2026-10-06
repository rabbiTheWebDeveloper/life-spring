import Button from "@/app/components/buttons/Button";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { message } from "antd";
import { useState } from "react";
import { getTokens } from "../../patient/action/AddPatient";

export default function ExportButton({ page, startDate, endDate, doctorId, rolePermissionTag }: any) {
	const [loading, setLoading] = useState<boolean>(false);
	const handleDownload = async () => {
		setLoading(true);
		try {
			const token = await getTokens();

			const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			const url = `${baseUrl}v2/appointment/export-doctor-revenue?format=xlsx&page=${page}${
				startDate ? `&from=${startDate}` : ""
			}${endDate ? `&to=${endDate}` : ""}${doctorId ? `&doctorId=${doctorId}` : ""}`;

			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Download failed");
			}
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);

			// Open the file in a new tab or trigger direct download
			const a = document.createElement("a");
			a.href = downloadUrl;
			a.download = `doctor_revenue_${Date.now()}.${"xlsx"}`;
			a.style.display = "none";
			document.body.appendChild(a);
			a.click();
			a.remove();

			URL.revokeObjectURL(downloadUrl);
			setLoading(false);
			message.success("Data exported successfully");
		} catch (error) {
			console.error("Error downloading file:", error);
			setLoading(false);
		}
	};
	return (
		<>
			<RolePermissionChecker tag={rolePermissionTag} name="export">
				<Button onButtonClick={handleDownload} tooltipTitle={"Export"}>
					{loading ? "...processing" : "Export"}
				</Button>
			</RolePermissionChecker>
		</>
	);
}
