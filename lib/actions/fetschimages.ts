export default async function fetchImages(query: string) {
    const API_KEY = "48913900-daceda5a36d735c189de9c5c0";
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&per_page=8`;

    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return { hits: [] }; // Return empty array in case of failure
    }
}
