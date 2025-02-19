export default async function fetchImages(query: string) {
    const API_KEY = "48913900-daceda5a36d735c189de9c5c0";
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&per_page=18`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return { hits: [] }; // Return empty array in case of failure
    }
}

export async function fetchImageById(imageId: string) {
    const API_KEY = "48913900-daceda5a36d735c189de9c5c0";
    const URL = `https://pixabay.com/api/?key=${API_KEY}&id=${encodeURIComponent(imageId)}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        // Pixabay API returns an array, so return the first item
        return data.hits.length > 0 ? data.hits[0] : null;
    } catch (error) {
        console.error("Error fetching image by ID:", error);
        return null; // Return null if fetching fails
    }
}
