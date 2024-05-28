import React from "react";
import { useLoaderData } from "react-router";
import { CollectionGalleryDisplay } from "../../Components/CollectionGallery/CollectionGalleryDisplay.js";

export const CollectionBrowser = () => {
    const images = useLoaderData();

    return (
        <CollectionGalleryDisplay
            images={images}
            isDialogMode={false}
        />
    );
};
