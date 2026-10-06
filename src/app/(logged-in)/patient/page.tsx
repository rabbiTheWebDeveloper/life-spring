"use client";

import { getPatientData, getTokens } from "@/app/(logged-in)/patient/action/AddPatient";
import CreatePatient from "@/app/(logged-in)/patient/components/CreatePatient";
import PatientFIlterSection from "@/app/(logged-in)/patient/components/PatientFIlterSection";
import PatientTable from "@/app/(logged-in)/patient/components/PatientTable";
import SearchableDropDown from "@/app/components/filters/SearchableDropDown";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { message } from "antd";
import { useEffect, useState } from "react";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const PatientPage = ({ searchParams }: Props) => {
	const page = searchParams.page ?? 0;
	const search = searchParams.search;
	const isActive = searchParams.isActive;
	const exportType: any = searchParams.export;
	// Every filter and the search text live in the URL, so the whole query string is the
	// fetch key. Keying on `page` alone left a new search or filter unfetched until
	// something else on the page changed.
	const queryKey = JSON.stringify(searchParams);
	const [loading, setLoading] = useState(true);
	const [isReset, setIsReset] = useState(false);
	const [update, setUpdate] = useState(false);

	const [patientData, setPatientData] = useState<any>([]);
	const fetchPatientData = async () => {
		setLoading(true);
		try {
			const res: any = await getPatientData(page, search, isActive);
			if (res?.success) {
				setPatientData(res.data);
			}
		} catch (error) {
			console.error("Error fetching services:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = async () => {
		try {
			const token = await getTokens();

			const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			const url = `${baseUrl}v1/patient/export?format=${exportType}&page=${page}&size=10${
				search ? `&search=${encodeURIComponent(search)}` : ""
			}${isActive ? `&isActive=${isActive}` : ""}`;

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
			a.download = `patients_${Date.now()}.${exportType}`;
			a.style.display = "none";
			document.body.appendChild(a);
			a.click();
			a.remove();

			URL.revokeObjectURL(downloadUrl);
			message.success("Data exported successfully");
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	useEffect(() => {
		fetchPatientData();
	}, [queryKey, isReset]);

	useEffect(() => {
		if (exportType) {
			handleDownload();
		}
	}, [exportType, page, search, isActive]);

	return (
		<>
			<ContentWrapper permissionTag="patient">
				<div className="flex flex-wrap justify-between items-center mb-4">
					<PatientFIlterSection
						page={page}
						search={search}
						isActive={isActive}
						fetchPatientData={fetchPatientData}
						setIsReset={setIsReset}
					/>
					<div className="flex gap-3">
						<SearchableDropDown
							url={`/patient?size=10&page=${page}${search ? `&search=${search}` : ""}${
								isActive ? `&isActive=${isActive}` : ""
							}`}
							prop="export"
							selectionOption={[
								{ value: "", label: "Select Export Option", disabled: false },
								{ value: "xlsx", label: "Xlsx" },
								// { value: "csv", label: "Csv" },
								// { value: "pdf", label: "Pdf" },
							]}
							selectedValue=""
							width={200}
						/>
						<CreatePatient fetchPatientData={fetchPatientData} setUpdate={setUpdate} update={update} />
					</div>
				</div>

				<PatientTable
					patients={patientData}
					url={`/patient?size=10${search ? `&search=${search}` : ""}${isActive ? `&isActive=${isActive}` : ""}`}
					loading={loading}
				/>
			</ContentWrapper>
		</>
	);
};

export default PatientPage;
