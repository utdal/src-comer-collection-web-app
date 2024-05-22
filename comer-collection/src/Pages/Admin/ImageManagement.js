import React, { useCallback, useEffect, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, Paper
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

const ImageManagement = () => {
    const [imagesCombinedState, setImages, setSelectedImages, filterImages] = useItemsReducer(Image);
    const [artistsCombinedState, setArtists, , filterArtists] = useItemsReducer(Artist);
    const [tagsCombinedState, setTags, , filterTags] = useItemsReducer(Tag);

    const [exhibitions, setExhibitions] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogImage, setDeleteDialogImage] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogImage, setEditDialogImage] = useState(null);

    const [assignArtistDialogIsOpen, setAssignArtistDialogIsOpen] = useState(false);
    const [assignTagDialogIsOpen, setAssignTagDialogIsOpen] = useState(false);
    const [viewImageExhibitionDialogIsOpen, setViewImageExhibitionDialogIsOpen] = useState(false);

    const [associationDialogImages, setAssociationDialogImages] = useState([]);

    const [previewerImage, setPreviewerImage] = useState(null);
    const [previewerOpen, setPreviewerOpen] = useState(false);

    const [manageArtistDialogIsOpen, setManageArtistDialogIsOpen] = useState(false);
    const [manageTagDialogIsOpen, setManageTagDialogIsOpen] = useState(false);

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
    }, []);

    const [appUser] = useAppUser();
    const navigate = useNavigate();
    useAccountNavTitle("Image Management");
    useTitle("Image Management");

    const fetchImages = useCallback(async () => {
        const fetchedImages = await Image.handleFetchAll();
        setImages(fetchedImages);

        setExhibitions(fetchedImages.map((i) => i.Exhibitions).flat());
    }, [setImages]);

    const fetchArtists = useCallback(async () => {
        setArtists(await Artist.handleFetchAll());
    }, [setArtists]);

    const fetchTags = useCallback(async () => {
        setTags(await Tag.handleFetchAll());
    }, [setTags]);

    const handleRefresh = useCallback(async () => {
        setIsError(false);
        Promise.all([
            fetchImages(),
            fetchArtists(),
            fetchTags()
        ]).then(() => {
            setIsLoaded(true);
        }).catch(() => {
            setIsError(true);
        });
    }, [fetchImages, fetchArtists, fetchTags]);

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

    const handleOpenMultiCreateDialog = useCallback(() => {
        setDialogIsOpen(true);
    }, []);

    const handleOpenImageEditDialog = useCallback((image) => {
        setEditDialogImage(image);
        setEditDialogIsOpen(true);
    }, []);

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
            <Box
                component={Paper}
                square
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: "80px calc(100vh - 224px) 80px",
                    gridTemplateAreas: `
                    "top"
                    "table"
                    "bottom"
                `
                }}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    padding={2}
                    spacing={2}
                    sx={{ gridArea: "top" }}
                >
                    <SearchBox
                        placeholder="Search image fields and notes"
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        width="30%"
                    />

                    <ManagementButtonStack>
                        <RefreshButton />

                        <ClearFilterButton />

                        <Button
                            color="primary"
                            onClick={() => {
                                setManageTagDialogIsOpen(true);
                            }}
                            startIcon={<SellIcon />}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Tags
                            </Typography>
                        </Button>

                        <Button
                            color="primary"
                            onClick={() => {
                                setManageArtistDialogIsOpen(true);
                            }}
                            startIcon={<BrushIcon />}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Artists
                            </Typography>
                        </Button>

                        <MultiCreateButton />
                    </ManagementButtonStack>
                </Stack>

                {(!isLoaded &&
                    <FullPageMessage
                        Icon={AccessTimeIcon}
                        message="Loading images..."
                    />
                ) || (isLoaded && (
                    <DataTable
                        emptyMinHeight="300px"
                        rowSelectionEnabled
                        tableFields={Image.tableFields}
                    />
                ))}

                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    padding={2}
                    spacing={2}
                    sx={{ gridArea: "bottom" }}
                >
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
                </Stack>

            </Box>

            <ItemMultiCreateDialog
                Entity={Image}
                allItems={imagesCombinedState.items}
                dialogInstructions={"Add images, edit the image fields, then click 'Create'.  You can add artists and tags after you have created the images."}
                dialogIsOpen={dialogIsOpen}
                refreshAllItems={fetchImages}
                setDialogIsOpen={setDialogIsOpen}
            />

            <ItemSingleEditDialog
                Entity={Image}
                editDialogIsOpen={editDialogIsOpen}
                editDialogItem={editDialogImage}
                refreshAllItems={fetchImages}
                setEditDialogIsOpen={setEditDialogIsOpen}
            />

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
                dialogIsOpen={manageArtistDialogIsOpen}
                dialogItemsCombinedState={artistsCombinedState}
                filterDialogItems={filterArtists}
                refreshAllItems={fetchArtists}
                searchBoxPlaceholder="Search artists by name or notes"
                setDialogIsOpen={setManageArtistDialogIsOpen}
                setDialogItems={setArtists}
            />

            <EntityManageDialog
                Entity={Tag}
                dialogIsOpen={manageTagDialogIsOpen}
                dialogItemsCombinedState={tagsCombinedState}
                filterDialogItems={filterTags}
                refreshAllItems={fetchTags}
                searchBoxPlaceholder="Search tags by name or notes"
                setDialogIsOpen={setManageTagDialogIsOpen}
                setDialogItems={setTags}
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
                            setManageArtistDialogIsOpen(true);
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
                secondaryItemsAll={artistsCombinedState.items}
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
                            setManageTagDialogIsOpen(true);
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
                secondaryItemsAll={tagsCombinedState.items}
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
