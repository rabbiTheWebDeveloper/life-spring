"use client";

import TitleBar from '@/app/components/text/TitleBar';
import { UserCommonData } from '@/types/User'
import React, { useState } from 'react'
import ProfileUpdateForm from '../ProfileUpdateForm';
import Image from 'next/image';

const ProfileUpdate = ({ user }: { user: UserCommonData }) => {
    const [preview, setPreview] = useState<string | null>(null);
    return (
        <div className=''>

            <div className="flex justify-between items-center">
                <div className="w-[50%]">
                    <ProfileUpdateForm user={user} setPreview={setPreview} />
                </div>

            </div>

        </div>
    )
}

export default ProfileUpdate
