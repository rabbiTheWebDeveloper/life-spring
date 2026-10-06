import { useState, useEffect } from "react";
import { getCounters } from "@/actions/GetCounters";
import { SidebarMenu } from "@/app/components/types/Layout";

export function useSidebarMenus(): Array<SidebarMenu> {
    const [counters, setCounters] = useState<any>({
        appointment: 0,
        instantCall: 0,
        selfRegistration: 0,
    });

    useEffect(() => {
        const fetchCounters = async () => {

            try {
                const data = await getCounters();
                setCounters(data);
            } catch (error) {
                console.error("Error fetching counters", error);
            }
        };

        fetchCounters();

        const interval = setInterval(() => {
            fetchCounters();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const menus: Array<SidebarMenu> = [
        { name: "Dashboard", link: "/dashboard", logo: "/dashboard.svg" },
        { name: "Doctor List", link: "/doctor", logo: "/coach.svg" },
        { name: "Patient", link: "/patient", logo: "/patient.svg" },
        { name: "Appointment", link: "/appointment", logo: "/appointment.svg", counter: counters.appointment },
        { name: "Instant call", link: "/emergency-appointment", logo: "/medeasy.svg", counter: counters.instantCall },
        {
            name: "Caregiver",
            link: "/caregiver",
            logo: "/caregiver.png",
            children: [
                { name: "Service Request list", link: "/caregiver/service-request" },
                { name: "Caregiver List", link: "/caregiver/list" },
                { name: "Category", link: "/caregiver/category" },
                { name: "Package", link: "/caregiver/package" },
            ],
        },
        { name: "Users", link: "/user", logo: "/user.svg", isOnlyForAdmin: true },
        { name: "Sliders", link: "/slider", logo: "/slider.svg", isOnlyForAdmin: true },
        { name: "Settlements", link: "/settlement", logo: "/settlement.svg", isOnlyForAdmin: true },
        { name: "Invoices", link: "/invoice", logo: "/invoice2.svg", isOnlyForAdmin: true },
        { name: "Refund", link: "/refund", logo: "/refund.svg", isOnlyForAdmin: true },
        { name: "Logs", link: "/log", logo: "/logs.svg", isOnlyForAdmin: true },
        { name: "MedEasy Orders", link: "/medeasy", logo: "/medeasy.svg" },
        { name: "Self Registration", link: "/self-registration", logo: "/self-reg.svg", isOnlyForAdmin: true, counter: counters.selfRegistration },
        { name: "Lab Tests", link: "/labtests", logo: "/lab.svg" },
        { name: "Reports", link: "/reports", logo: "/medeasy.svg" },
    ];

    return menus;
}
