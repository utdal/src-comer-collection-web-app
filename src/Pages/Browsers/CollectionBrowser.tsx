import React from "react";
import { useLoaderData } from "react-router";
import CollectionGalleryGrid from "../../Components/CollectionGallery/CollectionGalleryGrid.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import type { ImageItem } from "../../index.js";
import { Image } from "../../Classes/Entities/Image.js";
import useDialogStates from "../../Hooks/useDialogStates.js";

const CollectionBrowser = (): React.JSX.Element => {
    const images = useLoaderData() as ImageItem[];

    const [imagesCombinedState, itemsCallbacks] = useItemsReducer(images);

    const dialogCallbacks = useDialogStates([]);

    return (
        <ManagementPageProvider
            Entity={Image}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={imagesCombinedState}
            managementCallbacks={dialogCallbacks}
        >

            <CollectionGalleryGrid isDialogMode={false} />
        </ManagementPageProvider>
    );
};

export default CollectionBrowser;
