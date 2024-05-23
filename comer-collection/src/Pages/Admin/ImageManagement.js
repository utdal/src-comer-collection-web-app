import React, { useCallback, useEffect, useState } from "react";
import {
    Button,
    Typography
} from "@mui/material";
import { FullPageMessage } from "../../Components/FullPageMessage.js";
import SearchBox from "../../Components/SearchBox.js";
import { SellIcon, BrushIcon, AccessTimeIcon, WarningIcon, LockIcon } from "../../Imports/Icons.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Components/Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Components/Dialogs/ItemSingleEditDialog.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { Navigate, useNavigate } from "react-router";
import { ImageFullScreenViewer } from "../../Components/Dialogs/ImageFullScreenViewer.js";
import { EntityManageDialog } from "../../Components/Dialogs/EntityManageDialog.js";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog/AssociationManagementDialog.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";

import { useAccountNavTitle } from "../../Hooks/useAccountNavTitle.js";
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

const ImageManagement = () => {
    const [imagesCombinedState, setImages, setSelectedImages, filterImages] = useItemsReducer(Image);

    const [exhibitions, setExhibitions] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogImage, setDeleteDialogImage] = useState(null);

    const [assignArtistDialogIsOpen, setAssignArtistDialogIsOpen] = useState(false);
    const [assignTagDialogIsOpen, setAssignTagDialogIsOpen] = useState(false);
    const [viewImageExhibitionDialogIsOpen, setViewImageExhibitionDialogIsOpen] = useState(false);

    const [associationDialogImages, setAssociationDialogImages] = useState([]);

    const [previewerImage, setPreviewerImage] = useState(null);
    const [previewerOpen, setPreviewerOpen] = useState(false);

    const [manageArtistDialogState, openManageArtistDialog] = useDialogState();
    const [manageTagDialogState, openManageTagDialog] = useDialogState();

    const [createDialogState, handleOpenMultiCreateDialog] = useDialogState();
    const [editDialogState, openEditDialog] = useDialogState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
    }, []);

    const [appUser] = useAppUser();
    const navigate = useNavigate();
    useAccountNavTitle("Image Management");
    useTitle("Image Management");

    const handleRefresh = useCallback(async () => {
        setIsError(false);
        try {
            const fetchedImages = await Image.handleFetchAll();
            setImages(fetchedImages);
            setExhibitions(fetchedImages.map((i) => i.Exhibitions).flat());
            setIsLoaded(true);
        } catch (e) {
            setIsError(true);
        }
    }, [setImages]);

    useEffect(() => {
        if (appUser.is_admin_or_collection_manager) {
            handleRefresh();
        }
    }, [appUser.is_admin_or_collection_manager, handleRefresh]);

    const imageFilterFunction = useCallback((image) => {
        return (
            doesItemMatchSearchQuery(searchQuery, image, ["title", "valuationNotes", "otherNotes"])
        );
    }, [searchQuery]);

    const handleOpenImageAssignArtistDialog = useCallback((images) => {
        setAssociationDialogImages(images);
        setAssignArtistDialogIsOpen(true);
    }, []);

    const handleOpenImageAssignTagDialog = useCallback((images) => {
        setAssociationDialogImages(images);
        setAssignTagDialogIsOpen(true);
    }, []);

    const handleOpenImagePreviewer = useCallback((image) => {
        setPreviewerImage(image);
        setPreviewerOpen(true);
    }, []);

    const handleOpenImageViewExhibitionDialog = useCallback((image) => {
        setAssociationDialogImages([image]);
        setViewImageExhibitionDialogIsOpen(true);
    }, []);

    const handleOpenImageEditDialog = useCallback((image) => {
        openEditDialog(image);
    }, [openEditDialog]);

    const handleOpenImageDeleteDialog = useCallback((image) => {
        setDeleteDialogImage(image);
        setDeleteDialogIsOpen(true);
    }, []);

    useEffect(() => {
        filterImages(imageFilterFunction);
    }, [filterImages, imageFilterFunction]);

    return (!appUser.is_admin_or_collection_manager &&
        <FullPageMessage
            Icon={LockIcon}
            buttonDestination="/Account/Profile"
            buttonText="Return to Profile"
            message="Insufficient Privileges"
        />
    ) || (appUser.pw_change_required &&
        <Navigate to="/Account/ChangePassword" />
    ) || (isError &&
        <FullPageMessage
            Icon={WarningIcon}
            buttonAction={handleRefresh}
            buttonText="Retry"
            message="Error loading images"
        />
    ) || (!isLoaded &&
        <FullPageMessage
            Icon={AccessTimeIcon}
            message="Loading images..."
        />
    ) || (
        <ManagementPageProvider
            Entity={Image}
            itemsCombinedState={imagesCombinedState}
            managementCallbacks={{
                handleOpenImageAssignArtistDialog,
                handleOpenImageAssignTagDialog,
                handleOpenImageViewExhibitionDialog,
                handleOpenImagePreviewer,
                handleOpenMultiCreateDialog,
                handleOpenImageEditDialog,
                handleOpenImageDeleteDialog,
                handleClearFilters,
                handleRefresh
            }}
            setItems={setImages}
            setSelectedItems={setSelectedImages}
        >
            <ManagementPageContainer>
                <ManagementPageHeader>
                    <SearchBox
                        placeholder="Search image fields and notes"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        width="30%"
                    />

                    <ManagementButtonStack>
                        <RefreshButton />

                        <ClearFilterButton />

                        <EntityManageButton
                            entity={Tag}
                            handleOpenDialog={openManageTagDialog}
                        />

                        <EntityManageButton
                            entity={Artist}
                            handleOpenDialog={openManageArtistDialog}
                        />

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
                        <Button
                            disabled={imagesCombinedState.selectedItems.length === 0}
                            onClick={() => {
                                setAssociationDialogImages([...imagesCombinedState.selectedItems]);
                                setAssignArtistDialogIsOpen(true);
                            }}
                            startIcon={<BrushIcon />}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Manage Credits for
                                {imagesCombinedState.selectedItems.length}

                                {" "}

                                {imagesCombinedState.selectedItems.length === 1 ? "image" : "images"}
                            </Typography>
                        </Button>

                        <Button
                            disabled={imagesCombinedState.selectedItems.length === 0}
                            onClick={() => {
                                setAssociationDialogImages([...imagesCombinedState.selectedItems]);
                                setAssignTagDialogIsOpen(true);
                            }}
                            startIcon={<SellIcon />}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Manage Tags for
                                {imagesCombinedState.selectedItems.length}

                                {" "}

                                {imagesCombinedState.selectedItems.length === 1 ? "image" : "images"}
                            </Typography>
                        </Button>
                    </ManagementButtonStack>
                </ManagementPageFooter>

            </ManagementPageContainer>

            <ItemMultiCreateDialog dialogState={createDialogState} />

            <ItemSingleEditDialog dialogState={editDialogState} />

            <ItemSingleDeleteDialog
                Entity={Image}
                allItems={imagesCombinedState.items}
                deleteDialogIsOpen={deleteDialogIsOpen}
                deleteDialogItem={deleteDialogImage}
                setAllItems={setImages}
                setDeleteDialogIsOpen={setDeleteDialogIsOpen}
            />

            <EntityManageDialog
                Entity={Artist}
                dialogState={manageArtistDialogState}
                searchBoxPlaceholder="Search artists by name or notes"
            />

            <EntityManageDialog
                Entity={Tag}
                dialogState={manageTagDialogState}
                searchBoxPlaceholder="Search tags by name or notes"
            />

            <ImageFullScreenViewer
                image={previewerImage}
                previewerOpen={previewerOpen}
                setImage={setPreviewerImage}
                setPreviewerOpen={setPreviewerOpen}
            />

            <AssociationManagementDialog
                Association={ImageArtist}
                dialogButtonForSecondaryManagement={
                    <Button
                        onClick={() => {
                            setAssignArtistDialogIsOpen(false);
                            openManageArtistDialog();
                        }}
                        variant="outlined"
                    >
                        <Typography>
                            Go to artist management
                        </Typography>
                    </Button>
                }
                dialogIsOpen={assignArtistDialogIsOpen}
                editMode
                primaryItems={associationDialogImages}
                refreshAllItems={handleRefresh}
                secondaryFieldInPrimary="Artists"
                // secondaryItemsAll={artistsCombinedState.items}
                secondaryItemsAll={[]}
                secondarySearchBoxPlaceholder="Search artists by name or notes"
                secondarySearchFields={["fullName", "fullNameReverse", "notes"]}
                setDialogIsOpen={setAssignArtistDialogIsOpen}
            />

            <AssociationManagementDialog
                Association={ImageTag}
                dialogButtonForSecondaryManagement={
                    <Button
                        onClick={() => {
                            setAssignTagDialogIsOpen(false);
                            openManageTagDialog();
                        }}
                        variant="outlined"
                    >
                        <Typography>
                            Go to tag management
                        </Typography>
                    </Button>
                }
                dialogIsOpen={assignTagDialogIsOpen}
                editMode
                primaryItems={associationDialogImages}
                refreshAllItems={handleRefresh}
                secondaryFieldInPrimary="Tags"
                // secondaryItemsAll={tagsCombinedState.items}
                secondaryItemsAll={[]}
                secondarySearchBoxPlaceholder="Search tags by name or notes"
                secondarySearchFields={["data", "notes"]}
                setDialogIsOpen={setAssignTagDialogIsOpen}
            />

            <AssociationManagementDialog
                Association={ImageExhibition}
                dialogButtonForSecondaryManagement={
                    <Button
                        onClick={() => {
                            navigate("/Account/Admin/Exhibitions");
                        }}
                        variant="outlined"
                    >
                        <Typography>
                            Go to exhibition management
                        </Typography>
                    </Button>
                }
                dialogIsOpen={viewImageExhibitionDialogIsOpen}
                editMode={false}
                primaryItems={associationDialogImages}
                refreshAllItems={handleRefresh}
                secondaryItemsAll={exhibitions}
                secondarySearchBoxPlaceholder="Search exhibitions by title"
                secondarySearchFields={["title"]}
                setDialogIsOpen={setViewImageExhibitionDialogIsOpen}
            />

        </ManagementPageProvider>

    );
};

export default ImageManagement;
