import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox";
import { Outlet, useLoaderData, useRevalidator } from "react-router";
import ImageFullScreenViewer from "../../Components/Dialogs/ImageFullScreenViewerDialog.js";
import SelectionSummary from "../../Components/SelectionSummary.js";
import { useTitle } from "../../ContextProviders/AppFeatures";

import { Image } from "../../Classes/Entities/Image";
import { Artist } from "../../Classes/Entities/Artist";
import { Tag } from "../../Classes/Entities/Tag";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider";
import DataTable from "../../Components/DataTable/DataTable.js";
import ClearFilterButton from "../../Components/Buttons/ClearFilterButton.js";
import RefreshButton from "../../Components/Buttons/RefreshButton.js";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton.js";
import ManagementButtonStack from "../../Components/ManagementPage/ManagementButtonStack.js";
import ManagementPageContainer from "../../Components/ManagementPage/ManagementPageContainer.js";
import ManagementPageHeader from "../../Components/ManagementPage/ManagementPageHeader.js";
import ManagementPageBody from "../../Components/ManagementPage/ManagementPageBody.js";
import ManagementPageFooter from "../../Components/ManagementPage/ManagementPageFooter.js";
import EntityManageButton from "../../Components/Buttons/EntityManageButton.js";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary.js";
import OpenTrashButton from "../../Components/Buttons/OpenTrashButton.js";
import useDialogStates from "../../Hooks/useDialogStates.js";
import DialogByIntent from "../../Components/Dialogs/DialogByIntent.js";
import type { FilterFunction, ImageItem, Intent, Item } from "../..";
import { Typography } from "@mui/material";

const ImageManagement = (): React.JSX.Element => {
    const images = useLoaderData() as ImageItem[];
    const revalidator = useRevalidator();

    const [imagesCombinedState, itemsCallbacks] = useItemsReducer(images);

    const {
        setItems: setImages,
        filterItems: filterImages
    } = itemsCallbacks;

    useEffect(() => {
        setImages(images);
    }, [setImages, images]);

    const handleRefresh = useCallback(() => {
        revalidator.revalidate();
    }, [revalidator]);

    const intentArray: Intent[] = ["multi-create", "single-edit", "single-delete", "image-full-screen-preview"];
    const {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    } = useDialogStates(intentArray);

    const [searchQuery, setSearchQuery] = useState("");

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
    }, []);

    useTitle("Image Management");

    const imageFilterFunction: FilterFunction = useCallback((item: Item) => {
        return (item as ImageItem).id > 0;
    }, []);

    // const handleOpenImageAssignArtistDialog = useCallback((image) => {
    //     openAssignArtistDialog([image]);
    // }, [openAssignArtistDialog]);

    // const handleOpenImageAssignTagDialog = useCallback((image) => {
    //     openAssignTagDialog([image]);
    // }, [openAssignTagDialog]);

    // const handleOpenImageAssignArtistDialogForSelectedUsers = useCallback(() => {
    //     openAssignArtistDialog(imagesCombinedState.selectedItems);
    // }, [imagesCombinedState.selectedItems, openAssignArtistDialog]);

    // const handleOpenImageAssignTagDialogForSelectedUsers = useCallback(() => {
    //     openAssignTagDialog(imagesCombinedState.selectedItems);
    // }, [imagesCombinedState.selectedItems, openAssignTagDialog]);

    // const handleOpenImagePreviewer = useCallback((image) => {
    //     setPreviewerImage(image);
    //     setPreviewerOpen(true);
    // }, []);

    // const handleOpenImageViewExhibitionDialog = useCallback((image) => {
    //     openViewExhibitionDialog([image]);
    // }, [openViewExhibitionDialog]);

    // const handleSwitchToExhibitionsView = useCallback(() => {
    //     navigate("/Account/Admin/Exhibitions");
    // }, [navigate]);

    useEffect(() => {
        filterImages(imageFilterFunction);
    }, [filterImages, imageFilterFunction]);

    const managementCallbacks = useMemo(() => ({
        handleClearFilters,
        handleRefresh,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    }), [handleClearFilters,
        handleRefresh,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    ]);

    return (
        <ManagementPageProvider
            Entity={Image}
            itemsCallbacks={itemsCallbacks}
            itemsCombinedState={imagesCombinedState}
            managementCallbacks={managementCallbacks}
        >
            <ManagementPageContainer>
                <ManagementPageHeader>
                    <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        width="30%"
                    />

                    <ManagementButtonStack>
                        <RefreshButton />

                        <ClearFilterButton />

                        <EntityManageButton entity={Artist} />

                        <EntityManageButton entity={Tag} />

                        <OpenTrashButton />

                        <MultiCreateButton />
                    </ManagementButtonStack>
                </ManagementPageHeader>

                <ManagementPageBody>
                    <DataTable
                        rowSelectionEnabled
                        tableFields={Image.tableFields}
                    />
                </ManagementPageBody>

                <ManagementPageFooter>
                    <SelectionSummary />

                    <ManagementButtonStack>
                        <Typography>
                            Placeholder for association management dialog buttons
                        </Typography>

                        {/* <AssociationManageButton
                            handleOpenDialog={handleOpenImageAssignArtistDialogForSelectedUsers}
                            secondaryEntity={Artist}
                        />
                        <AssociationManageButton
                            handleOpenDialog={handleOpenImageAssignTagDialogForSelectedUsers}
                            secondaryEntity={Tag}
                        /> */}
                    </ManagementButtonStack>

                    <PaginationSummary />
                </ManagementPageFooter>

            </ManagementPageContainer>

            {intentArray.map((intent) => (
                <DialogByIntent
                    dialogState={dialogStateDictionary[intent]}
                    intent={intent}
                    key={intent}
                />
            ))}

            {/* Entity manage dialogs and any trash dialogs are child routes of the page and use the outlet */}
            <Outlet />

            <ImageFullScreenViewer dialogState={dialogStateDictionary["image-full-screen-preview"]} />

            {/* <AssociationManagementDialog
                Association={ImageArtist}
                dialogState={assignArtistDialogState}
                editMode
                // handleSwitchToSecondary={handleSwitchToArtistsView}
                // secondaryItemsAll={artistsCombinedState.items}
                secondaryItemsAll={[]}
            />

            <AssociationManagementDialog
                Association={ImageTag}
                dialogState={assignTagDialogState}
                editMode
                // handleSwitchToSecondary={handleSwitchToTagsView}
                // secondaryItemsAll={tagsCombinedState.items}
                secondaryItemsAll={[]}
            />

            <AssociationManagementDialog
                Association={ImageExhibition}
                dialogState={viewExhibitionDialogState}
                handleSwitchToSecondary={handleSwitchToExhibitionsView}
                secondaryItemsAll={[]}
            /> */}

        </ManagementPageProvider>

    );
};

export default ImageManagement;
