"use client";
import {
	getDoctorSpeciality,
	getPatientInformation,
	getService,
} from "@/app/(logged-in)/appointment-booking/actions/services";
import Booking from "@/app/(logged-in)/appointment-booking/components/Booking";
import { getOptions } from "@/app/actions/getOptions";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { emptyOptions, Options } from "@/app/types/Options";
import { useEffect, useState } from "react";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const AppointmentBookingContainer = ({ searchParams }: Props) => {
	const [page, setPage] = useState<number>(0);
	const [size, setSize] = useState<number>(10);
	const [doctorsData, setDoctorsData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [doctorSpeciality, setDoctorSpeciality] = useState<any>([]);
	const [selectedDoctorId, setSelectedDoctorId] = useState<any>("");

	const type = searchParams?.type ?? "";
	const id = searchParams?.id ?? "";
	const speciality = searchParams?.speciality ?? "";
	const search = searchParams?.search ?? "";
	const [patientDetail, setPatientDetail] = useState<any>(null);
	const [options, setOptions] = useState<Options>(emptyOptions);

	useEffect(() => {
		getOptions().then(setOptions);
	}, []);

	useEffect(() => {
		if (searchParams.page) {
			setPage(Number(searchParams.page));
		}
		if (searchParams.size) {
			setSize(Number(searchParams.size));
		}
	}, [searchParams]);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				setLoading(true);
				const data = await getService(size, page, speciality, search);
				setDoctorsData(data?.data);
				console.log("Doctors Data:", data?.data);
			} catch (error) {
				console.error("Error fetching services:", error);
			} finally {
				setLoading(false);
			}
		};
		if (type === "patient" || !type) {
			fetchDoctors();
		} else {
			setLoading(false);
		}
		// fetchDoctors()
	}, [page, size, speciality, search]);

	//Doctor Speciality Get

	useEffect(() => {
		const fetchDoctorSpeciality = async () => {
			try {
				const data = await getDoctorSpeciality();
				setDoctorSpeciality(data?.data);
			} catch (error) {
				console.error("Error fetching services:", error);
			} finally {
			}
		};
		fetchDoctorSpeciality();
	}, []);

	const fetchPatientDetails = async (id: any) => {
		try {
			const res = await getPatientInformation(id);
			if (res?.statusCode == 200) {
				setPatientDetail(res?.data);
			} else {
				setPatientDetail(null);
			}
		} catch (error) {
			console.error("Error fetching services:", error);
		} finally {
		}
	};

	useEffect(() => {
		if (type == "patient" && id) {
			fetchPatientDetails(id);
		} else if (type == "doctor" && id) {
			setSelectedDoctorId(id);
		}
	}, [type, id]);

	return (
		<ContentWrapper permissionTag={""}>
			<Booking
				doctorsData={doctorsData}
				doctorSpeciality={doctorSpeciality}
				search={search}
				loading={loading}
				patientDetail={patientDetail}
				page={page}
				type={type}
				id={id}
				speciality={speciality}
				selectedDoctorId={selectedDoctorId}
				setSelectedDoctorId={setSelectedDoctorId}
				paginationUrl={`appointment-booking?${type ? `&type=${type}` : ""}${id ? `&id=${id}` : ""}${
					speciality ? `&speciality=${speciality}` : ""
				}${search ? `&search=${search}` : ""}`}
				options={options}
			/>
		</ContentWrapper>
	);
};

export default AppointmentBookingContainer;
