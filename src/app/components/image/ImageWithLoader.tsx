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
}

const ImageWithLoader = ({ src, alt, altImage, height, width, cls }: any) => {
    return (
        <div>
            <Image src={(src && src.length > 0) ? src : altImage} width={width} height={height}
                alt={alt} loader={loaderProp} className={cls} />
        </div>
    )
}

export default ImageWithLoader
