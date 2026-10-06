'use client'

import React, { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';

const formatDateTime = (isoString: string): string => {
  try {
    const date = parseISO(isoString);
    const time = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
    const day = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
    return `${time} ${day}`;
  } catch (error) {
    console.error('Error parsing date:', error);
    return '-';
  }
};

const FormattedDateTime: React.FC<{ isoString: string }> = ({ isoString }) => {
  const [formattedDateTime, setFormattedDateTime] = useState<string>('');

  useEffect(() => {
    setFormattedDateTime(formatDateTime(isoString));
  }, [isoString]);

  return <span>{formattedDateTime}</span>;
};

export default FormattedDateTime;
