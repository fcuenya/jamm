import { useState, useEffect } from 'react';
import { DataFetch, AlbumData } from '@packages/core/data';

const API_HOST = "http://localhost:3000";
const API_URL = `${API_HOST}/api/albums`//"http://localhost:3000/albums?_page=1&_limit=500";

//TODO: find a better way to handle artwork media 
// const getLocalArtwork = (uuid) => `file:///Users/fcuenyafolgar/devel/github/jamm/server/data/artwork/${uuid}-artwork.${format}`;

//TODO: define types for the API responses, or better yet find a way to share types between backend and client for this
// @ts-ignore
const asAlbumDataArray = (jsonData): AlbumData[] => jsonData.map((album) => {
    const { id, uuid, title, albumArtist, artwork, tracks } = album;
    return {
        id,
        title,
        artist: albumArtist,
        albumArt: `${API_HOST}/artwork/${uuid}`,
        tracks
    };
});

const useAlbumData: () => DataFetch<AlbumData> = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        fetch(API_URL, { method: "GET" }).then(async (response) => {
            if (response.ok) {
                const jsonData = await response.json();
                // setData(jsonData);
                //TODO
                // @ts-ignore
                setData(asAlbumDataArray(jsonData));
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
