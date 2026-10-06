"use client";

import { loaderProp } from '@/helper/ImageHelper';
import Image from 'next/image';
import React from 'react'

interface Props {
    src?: string;
    altImage: string;
    width: number;
    height: number;
    alt: string;
    cls?: string;
    fileType: 'image' | 'pdf';
}

const AttachmentWithLoader = ({ src, alt, altImage, height, width, cls, fileType }: Props) => {
    if (fileType === 'pdf') {
        return (
            <div className={`flex items-center justify-center ${cls}`} style={{ width, height }}>
                <embed src={src ?? altImage} type="application/pdf" width={width} height={height} />
            </div>
        )
    }

    return (
        <div>
            <Image src={src ?? altImage} width={width} height={height}
                alt={alt} loader={loaderProp} className={cls} />
        </div>
    )
}

export default AttachmentWithLoader
