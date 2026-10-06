import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { message, Spin, Tooltip } from "antd";
import { useState } from "react";
import { TbInvoice } from "react-icons/tb";
import { exportInvoice } from "../actions/exportInvoiceAction";

export default function ExportInvoice({ id, isCurrencyUSD }: any) {
	const [loading, setLoading] = useState<boolean>(false);
	async function handleExportInvoice() {
		setLoading(true);
		try {
			const response = await exportInvoice(id, isCurrencyUSD);
			console.log("Export Invoice Response:", response);

			if (response.success && response.data) {
				const link = document.createElement("a");
				link.href = response.data;
				link.setAttribute("download", `invoice_${id}.pdf`);
				link.target = "_blank"; // optional: open in new tab
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} else {
				throw new Error("Invoice URL not found in response");
			}
		} catch (error) {
			console.error("Failed to export invoice:", error);
			message.error("Failed to download invoice");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<RolePermissionChecker tag="appointment" name="list">
				<Tooltip
					placement="top"
					title={isCurrencyUSD ? "Export USD Invoice" : "Export Invoice"}
					color={isCurrencyUSD ? "#2557w5" : "#2db7f5"}
				>
					<div
						className={`${
							isCurrencyUSD ? "bg-amber-400 " : "bg-indigo-400 "
						}" flex items-center justify-center rounded-md p-1 cursor-pointer text-white"`}
						onClick={handleExportInvoice}
					>
						{loading ? <Spin size="small" className="text-white" /> : <TbInvoice size={16} />}
					</div>
				</Tooltip>
			</RolePermissionChecker>
		</div>
	);
}
