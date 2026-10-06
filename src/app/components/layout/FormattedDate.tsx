'use client'

import React, { useEffect, useState } from 'react';
import { formatDateOnly } from '@/helper/DateTimeHelper';

interface Props {
	isoString: any;
}

const FormattedDate: any = ({ isoString }: Props) => {

	if (!isoString) return <span></span>;
	return <span>{formatDate(isoString)}</span>;
};

export default FormattedDate;

export function formatDate(isoString: string): string {
	if (!isoString) return '-';
	return formatDateOnly(isoString);
}
