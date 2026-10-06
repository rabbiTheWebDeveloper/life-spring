'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { Invoices } from '../types/Types';
import Invoice from './Invoice';
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

interface Props {
    invoices: Invoices;
}

const InvoiceTabs = ({ invoices }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState<'pending' | 'disbursed'>('pending');

    useEffect(() => {
        const isDisbursed = searchParams.get('isDisbursed');
        if (isDisbursed === 'true') {
            setActiveTab('disbursed');
        } else {
            setActiveTab('pending');
        }
    }, [searchParams]);

    const handleTabChange = (tab: 'pending' | 'disbursed') => {
        setActiveTab(tab);
        const isDisbursed = tab === 'disbursed' ? 'true' : 'false';
        router.push(`invoice?size=10&isDisbursed=${isDisbursed}&page=0`, { scroll : false });
    };

    return (
			<SidebarPermission tag="administration-invoice">
				<RolePermissionChecker tag="administration-invoice" name="list">
					<div className="flex flex-col ">
						<div className="flex justify-between border-b border-gray-200">
							<div className='flex gap-4 md:justify-between'>
								<button
									className={clsx("md:py-2 font-medium text-sm  ",
										{
											"border-b-2 text-primary border-[#9B468A] ": activeTab === 'pending',
											"text-gr": activeTab !== 'pending',
										})}
									onClick={() => handleTabChange('pending')}
								>
									PENDING INVOICES
								</button>
								<button
									className={clsx("md:py-2 font-medium text-sm",
										{
											"border-b-2 text-primary border-[#9B468A]": activeTab === 'disbursed',
											"text-gr": activeTab !== 'disbursed',
										})}
									onClick={() => handleTabChange('disbursed')}
								>
									DISBURSED INVOICES
								</button>
							</div>
						</div>

						<div className="overflow-y-auto grid grid-cols-12">
							<div className="col-span-12"><Invoice invoices={invoices}/></div>
						</div>
					</div>
				</RolePermissionChecker>

			</SidebarPermission>

		)
}

export default InvoiceTabs
