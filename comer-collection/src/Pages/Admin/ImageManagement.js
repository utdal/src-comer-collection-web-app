import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../Components/SearchBox.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Components/Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Components/Dialogs/ItemSingleEditDialog.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { Outlet, useLoaderData, useNavigate, useRevalidator } from "react-router";
import { ImageFullScreenViewer } from "../../Components/Dialogs/ImageFullScreenViewer.js";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog/AssociationManagementDialog.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";

import { Image } from "../../Classes/Entities/Image.js";
import { Artist } from "../../Classes/Entities/Artist.js";
import { Tag } from "../../Classes/Entities/Tag.js";
import { ImageArtist } from "../../Classes/Associations/ImageArtist.js";
import { ImageTag } from "../../Classes/Associations/ImageTag.js";
import { ImageExhibition } from "../../Classes/Associations/ImageExhibition.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";
import { ClearFilterButton } from "../../Components/Buttons/ClearFilterButton.js";
import { RefreshButton } from "../../Components/Buttons/RefreshButton.js";
import { MultiCreateButton } from "../../Components/Buttons/MultiCreateButton.js";
import { ManagementButtonStack } from "../../Components/ManagementPage/ManagementButtonStack.js";
import { ManagementPageContainer } from "../../Components/ManagementPage/ManagementPageContainer.js";
import { ManagementPageHeader } from "../../Components/ManagementPage/ManagementPageHeader.js";
import { ManagementPageBody } from "../../Components/ManagementPage/ManagementPageBody.js";
import { ManagementPageFooter } from "../../Components/ManagementPage/ManagementPageFooter.js";
import { useDialogState } from "../../Hooks/useDialogState.js";
import EntityManageButton from "../../Components/Buttons/EntityManageButton.js";
import AssociationManageButton from "../../Components/Buttons/AssociationManageButton.js";
import PaginationSummary from "../../Components/PaginationSummary/PaginationSummary.js";
import OpenTrashButton from "../../Components/Buttons/OpenTrashButton.js";
import useDialogStates from "../../Hooks/useDialogStates.js";

const ImageManagement = () => {
    const images = useLoaderData();
    const revalidator = useRevalidator();

    const [imagesCombinedState, itemsCallbacks] = useItemsReducer(images);

    const {
        setItems: setImages,
        filterItems: filterImages
    } = itemsCallbacks;

    useEffect(() => {
        setImages(images);
    }, [setImages, images]);

    const handleRefresh = useCallback(async () => {
        revalidator.revalidate();
    }, [revalidator]);

    const [previewerImage, setPreviewerImage] = useState(null);
    const [previewerOpen, setPreviewerOpen] = useState(false);

    /**
     * @type {import("../../Classes/buildRouterAction.js").Intent[]}
     */
    const intentArray = ["multi-create", "single-edit", "single-delete"];
    const {
        dialogStateDictionary,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    } = useDialogStates(intentArray);

    const [editDialogState, openEditDialog] = useDialogState(false);
    const [deleteDialogState, openDeleteDialog] = useDialogState(false);

    const [assignArtistDialogState, openAssignArtistDialog] = useDialogState(true);
    const [assignTagDialogState, openAssignTagDialog] = useDialogState(true);
    const [viewExhibitionDialogState, openViewExhibitionDialog] = useDialogState(true);

    const [searchQuery, setSearchQuery] = useState("");

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
    }, []);

    const navigate = useNavigate();
    useTitle("Image Management");

    const imageFilterFunction = useCallback((image) => {
        return (
            doesItemMatchSearchQuery(searchQuery, image, ["title", "valuationNotes", "otherNotes"])
        );
    }, [searchQuery]);

    const handleOpenImageAssignArtistDialog = useCallback((image) => {
        openAssignArtistDialog([image]);
    }, [openAssignArtistDialog]);

    const handleOpenImageAssignTagDialog = useCallback((image) => {
        openAssignTagDialog([image]);
    }, [openAssignTagDialog]);

    const handleOpenImageAssignArtistDialogForSelectedUsers = useCallback(() => {
        openAssignArtistDialog(imagesCombinedState.selectedItems);
    }, [imagesCombinedState.selectedItems, openAssignArtistDialog]);

    const handleOpenImageAssignTagDialogForSelectedUsers = useCallback(() => {
        openAssignTagDialog(imagesCombinedState.selectedItems);
    }, [imagesCombinedState.selectedItems, openAssignTagDialog]);

    const handleOpenImagePreviewer = useCallback((image) => {
        setPreviewerImage(image);
        setPreviewerOpen(true);
    }, []);

    const handleOpenImageViewExhibitionDialog = useCallback((image) => {
        openViewExhibitionDialog([image]);
    }, [openViewExhibitionDialog]);

    const handleOpenImageEditDialog = useCallback((image) => {
        openEditDialog(image);
    }, [openEditDialog]);

    const handleOpenImageDeleteDialog = useCallback((image) => {
        openDeleteDialog(image);
    }, [openDeleteDialog]);

    const handleSwitchToExhibitionsView = useCallback(() => {
        navigate("/Account/Admin/Exhibitions");
    }, [navigate]);

    useEffect(() => {
        filterImages(imageFilterFunction);
    }, [filterImages, imageFilterFunction]);

    const managementCallbacks = useMemo(() => ({
        handleOpenImageAssignArtistDialog,
        handleOpenImageAssignTagDialog,
        handleOpenImageViewExhibitionDialog,
        handleOpenImagePreviewer,
        handleOpenImageEditDialog,
        handleOpenImageDeleteDialog,
        handleClearFilters,
        handleRefresh,
        openDialogByIntentWithNoUnderlyingItems,
        openDialogByIntentWithSingleUnderlyingItem,
        openDialogByIntentWithMultipleUnderlyingItems,
        closeDialogByIntent
    }), [handleClearFilters,
        handleOpenImageAssignArtistDialog,
        handleOpenImageAssignTagDialog,
        handleOpenImageDeleteDialog,
        handleOpenImageEditDialog,
        handleOpenImagePreviewer,
        handleOpenImageViewExhibitionDialog,
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
                        emptyMinHeight="300px"
                        rowSelectionEnabled
                        tableFields={Image.tableFields}
                    />
                </ManagementPageBody>

                <ManagementPageFooter>
                    <SelectionSummary />

                    <ManagementButtonStack>
                        <AssociationManageButton
                            handleOpenDialog={handleOpenImageAssignArtistDialogForSelectedUsers}
                            secondaryEntity={Artist}
                        />

                        <AssociationManageButton
                            handleOpenDialog={handleOpenImageAssignTagDialogForSelectedUsers}
                            secondaryEntity={Tag}
                        />
                    </ManagementButtonStack>

                    <PaginationSummary />
                </ManagementPageFooter>

            </ManagementPageContainer>

            <ItemMultiCreateDialog dialogState={dialogStateDictionary["multi-create"]} />

            <ItemSingleEditDialog dialogState={editDialogState} />

            <ItemSingleDeleteDialog dialogState={deleteDialogState} />

            {/* Entity manage dialogs and any trash dialogs are child routes of the page and use the outlet */}
            <Outlet />

            <ImageFullScreenViewer
                image={previewerImage}
                previewerOpen={previewerOpen}
                setImage={setPreviewerImage}
                setPreviewerOpen={setPreviewerOpen}
            />

            <AssociationManagementDialog
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
            />

        </ManagementPageProvider>

    );
};

export default ImageManagement;
