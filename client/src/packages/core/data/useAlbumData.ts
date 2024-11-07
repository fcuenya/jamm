import { useState, useEffect } from 'react';
import { DataFetch, AlbumData } from '@packages/core/data';

const useAlbumData: () => DataFetch<AlbumData> = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        fetch("http://localhost:3000/albums?_page=1&_limit=500", { method: "GET" }).then(async (response) => {
            if (response.ok) {
                const jsonData = await response.json();
                setData(jsonData);
            }
            else
                throw new Error(`Error response: ${response.status}`);
        })
            .catch((error) => {
                console.log(error.message);
            })
            .finally(() => { setIsLoading(false); });
    }, []);
    return { isLoading, data };
};

export default useAlbumData;