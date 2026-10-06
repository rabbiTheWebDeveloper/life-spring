"use client";

import { useState } from "react";
import { getYoutubeThumbnail, getYoutubeVideoId } from "../utils/youtube";

interface Props {
	defaultValue?: string;
}

/**
 * "Doctor Introduction Video" input. Shows a live YouTube thumbnail preview so the
 * admin can confirm the link resolves to the right video before saving.
 * Plain `name` attribute — both doctor forms build their payload from FormData.
 */
const IntroVideoField = ({ defaultValue = "" }: Props) => {
	const [url, setUrl] = useState(defaultValue ?? "");

	const trimmed = url.trim();
	const videoId = getYoutubeVideoId(trimmed);
	const isInvalid = trimmed.length > 0 && !videoId;

	return (
		<div className="flex flex-col gap-1 justify-start">
			<label className="text-gr text-medium text-sm">Doctor Introduction Video (YouTube link)</label>
			<input
				className={`border-2 rounded-md p-2 text-gr focus:outline-none ${isInvalid ? "border-red-400" : ""}`}
				name="introVideoUrl"
				type="text"
				placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
				maxLength={2083}
				value={url}
				onChange={(e) => setUrl(e.target.value)}
			/>

			{isInvalid && (
				<p className="text-red-500 text-xs">
					Not a valid YouTube link. Use a watch, youtu.be, embed or shorts URL.
				</p>
			)}

			{videoId && (
				<div className="mt-2">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={getYoutubeThumbnail(videoId)}
						alt="Video thumbnail preview"
						className="w-56 aspect-video object-cover rounded-md border"
					/>
					<p className="text-gr text-xs mt-1">
						Preview — the website shows this thumbnail on the doctor details page.
					</p>
				</div>
			)}

			{!trimmed && (
				<p className="text-gr text-xs">
					Leave empty to hide the video card. Use landscape videos — Shorts (9:16) crop badly.
				</p>
			)}
		</div>
	);
};

export default IntroVideoField;
