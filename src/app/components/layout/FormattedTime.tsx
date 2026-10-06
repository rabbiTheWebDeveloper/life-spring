'use client'

import React, { useEffect, useState } from 'react';

interface Props {
	isoString: string;
}


const FormattedTime: React.FC<Props> = ({ isoString }) => {
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    const formatTime = (isoString: string): string => {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    };

    setFormattedTime(formatTime(isoString));
  }, [isoString]);

  return <span>{formattedTime}</span>;
}

export default FormattedTime;
