import React from 'react';
import SearchFromList from "@/app/components/filters/SearchFromList";
import SearchableDropDown from "@/app/components/filters/SearchableDropDown";
import ResetFilterButton from "@/app/components/buttons/ResetFilterButton";
import FilterWrapper from "@/app/components/layout/wrappers/FilterWrapper";
import FilterButton from "@/app/components/buttons/FilterButton";

const PatientFIlterSection = ({page,search,isActive,fetchPatientData,setIsReset}:any) => {
	return (
		<div>
			<FilterWrapper permissionTag="patient">
				{/* A changed filter starts at page 0; the current page may not exist in the narrowed result set. */}
				<SearchFromList
					url={`/patient?size=10&page=0${isActive ? `&isActive=${isActive}` : ""}`}
					prop="search"
					placeholder="Search"
				/>
				<SearchableDropDown
					url={`/patient?size=10&page=0${search ? `&search=${search}` : ""}`}
					prop="isActive"
					selectionOption={[
						{value: "", label: "Select Status", disabled: false},
						{value: "true", label: "Active"},
						{value: "false", label: "Inactive"},
					]}
					selectedValue=""
					width={300}
				/>

				<FilterButton onButtonClick={fetchPatientData} />
				<ResetFilterButton setIsReset={setIsReset} />
			</FilterWrapper>
		</div>
	);
};

export default PatientFIlterSection;
