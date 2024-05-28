import React from "react";
import { useLoaderData } from "react-router";
import { CollectionGalleryGrid } from "../../Components/CollectionGallery/CollectionGalleryGrid.js";

export const CollectionBrowser = () => {
    const images = useLoaderData();

    return (
        <CollectionGalleryGrid
            images={images}
            isDialogMode={false}
        />
    );
};
