import React from "react";
import { useLoaderData } from "react-router";
import CollectionGalleryGrid from "../../Components/CollectionGallery/CollectionGalleryGrid";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider";
import type { ImageItem } from "../../index";
import { Image } from "../../Classes/Entities/Image";
import useDialogStates from "../../Hooks/useDialogStates";

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
