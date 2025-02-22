export type PixabayImage = {
    id: number;
    pageURL: string;
    type: string;
    tags: string;
    previewURL: string;
    previewWidth: number;
    previewHeight: number;
    webformatURL: string;
    webformatWidth: number;
    webformatHeight: number;
    largeImageURL: string;
    imageWidth: number;
    imageHeight: number;
    imageSize: number;
    views: number;
    downloads: number;
    collections: number;
    likes: number;
    comments: number;
    user_id: number;
    user: string;
    userImageURL: string;
};

export interface SearchProps {
    searchParams: { q?: string };
}

export const tabs = [
    "Cars",
    "Speed",
    "Music",
    "Movies",
    "Travel",
    "Nature",
    "Company",
    "Fashion",
    "Flowers",
    "Tech",
];

export interface ImageDetails {
    id: string;
    webformatURL: string;
    largeImageURL: string;
    tags: string;
    user: string;
    downloads: number;
    views: number;
    likes: number;
    previewURL?: string;
}