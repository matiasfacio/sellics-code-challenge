import React from "react";
import { Picture } from "../features/pictures/picturesSlice";

export const usePictureFetch = () => {
  const [nextPicture, setNextPicture] = React.useState<Picture | null>(null);
  const [errorFetching, setErrorFetching] = React.useState<string | null>(null);

  const fetchData = async () => {
    const result = await fetch(
      `https://api.unsplash.com/photos/random/?client_id=kRjBgdU-lODWDMuDTBH6fTml7Hd8j1ECQ9IrsNv5Qt4&w=300&h=300`
    );
    if (!result.ok) {
      setErrorFetching("Error Fetching Data");
      setTimeout(() => {
        setErrorFetching(null);
      }, 3000);
    } else {
      const data = await result.json();
      setNextPicture(data.urls.regular);
    }
  };

  const fetchNextPicture = (): void => {
    fetchData();
  };

  return { nextPicture, fetchNextPicture, errorFetching };
};
