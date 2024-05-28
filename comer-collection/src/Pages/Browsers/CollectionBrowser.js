import React from "react";
import { useLoaderData } from "react-router";
import { CollectionGalleryGrid } from "../../Components/CollectionGallery/CollectionGalleryGrid.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";

export const CollectionBrowser = () => {
    const images = useLoaderData();

    const [imagesCombinedState, itemsCallbacks] = useItemsReducer(images);

    return (
        <ManagementPageProvider
            Entity={Image}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={imagesCombinedState}
        >

            <CollectionGalleryGrid
                images={images}
                isDialogMode={false}
            />
        </ManagementPageProvider>
    );
};
