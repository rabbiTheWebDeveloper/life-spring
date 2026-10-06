/**
 * YouTube link helpers. Kept in sync with the backend validator
 * (lifespring-backend/src/common/decorators/is-youtube-url.decorator.ts).
 */
export const YOUTUBE_URL_REGEX =
	/^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^\s]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#][^\s]*)?$/;

export const getYoutubeVideoId = (url?: string | null): string | null => {
	if (!url) return null;
	const match = url.trim().match(YOUTUBE_URL_REGEX);
	return match ? match[1] : null;
};

/**
 * `hqdefault.jpg` is 4:3 with black bars — never use it. `mqdefault.jpg` (320x180)
 * is 16:9 and always exists, so it is the safe preview size for the admin panel.
 */
export const getYoutubeThumbnail = (videoId: string): string =>
	`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
