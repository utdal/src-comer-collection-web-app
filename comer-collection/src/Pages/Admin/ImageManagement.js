import React, { useCallback, useEffect, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, Paper
} from "@mui/material";
import { FullPageMessage } from "../../Components/FullPageMessage.js";
import SearchBox from "../../Components/SearchBox.js";
import { FilterAltOffOutlinedIcon, RefreshIcon, InfoIcon, SearchIcon, AddPhotoAlternateIcon, SellIcon, BrushIcon, AccessTimeIcon, WarningIcon, LockIcon } from "../../Imports/Icons.js";
import { ItemSingleDeleteDialog } from "../../Components/Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../../Components/Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../../Components/Dialogs/ItemSingleEditDialog.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { Navigate, useNavigate } from "react-router";
import { ImageFullScreenViewer } from "../../Components/Dialogs/ImageFullScreenViewer.js";
import { EntityManageDialog } from "../../Components/Dialogs/EntityManageDialog.js";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog/AssociationManagementDialog.js";
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { useTitle } from "../../ContextProviders/AppFeatures.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";

import { useAccountNav } from "../../ContextProviders/AccountNavProvider.js";
import { Image } from "../../Classes/Entities/Image.js";
import { Artist } from "../../Classes/Entities/Artist.js";
import { Tag } from "../../Classes/Entities/Tag.js";
import { ImageArtist } from "../../Classes/Associations/ImageArtist.js";
import { ImageTag } from "../../Classes/Associations/ImageTag.js";
import { ImageExhibition } from "../../Classes/Associations/ImageExhibition.js";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { DataTable } from "../../Components/DataTable/DataTable.js";

const ImageManagement = () => {
    const [imagesCombinedState, setImages, setSelectedImages, filterImages] = useItemsReducer();
    const [artistsCombinedState, setArtists, , filterArtists] = useItemsReducer();
    const [tagsCombinedState, setTags, , filterTags] = useItemsReducer();

    const [exhibitions, setExhibitions] = useState([]);
    const [refreshInProgress, setRefreshInProgress] = useState(true);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogImage, setDeleteDialogImage] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogImage, setEditDialogImage] = useState(null);

    const [assignArtistDialogIsOpen, setAssignArtistDialogIsOpen] = useState(false);
    const [assignArtistDialogImages, setAssignArtistDialogImages] = useState([]);
    const [artistsByImage, setArtistsByImage] = useState({});

    const [assignTagDialogIsOpen, setAssignTagDialogIsOpen] = useState(false);
    const [assignTagDialogImages, setAssignTagDialogImages] = useState([]);
    const [tagsByImage, setTagsByImage] = useState({});

    const [viewImageExhibitionDialogIsOpen, setViewImageExhibitionDialogIsOpen] = useState(false);
    const [viewImageExhibitionDialogImages, setViewImageExhibitionDialogImages] = useState([]);
    const [exhibitionsByImage, setExhibitionsByImage] = useState({});

    const [previewerImage, setPreviewerImage] = useState(null);
    const [previewerOpen, setPreviewerOpen] = useState(false);

    const [manageArtistDialogIsOpen, setManageArtistDialogIsOpen] = useState(false);
    const [manageTagDialogIsOpen, setManageTagDialogIsOpen] = useState(false);

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const clearFilters = () => {
        setSearchQuery("");
    };

    const [, setSelectedNavItem] = useAccountNav();
    const [appUser] = useAppUser();
    const setTitleText = useTitle();
    const navigate = useNavigate();

    const fetchImages = useCallback(async () => {
        const imageData = await sendAuthenticatedRequest("GET", "/api/admin/images");
        setImages(imageData.data);

        setTimeout(() => {
            setRefreshInProgress(false);
        }, 1000);

        const artistsByImageDraft = {};
        for (const i of imageData.data) {
            artistsByImageDraft[i.id] = i.Artists;
        }
        setArtistsByImage({ ...artistsByImageDraft });

        const tagsByImageDraft = {};
        for (const i of imageData.data) {
            tagsByImageDraft[i.id] = i.Tags;
        }
        setTagsByImage({ ...tagsByImageDraft });

        setExhibitions(imageData.data.map((i) => i.Exhibitions).flat());

        const exhibitionsByImageDraft = {};
        for (const i of imageData.data) {
            exhibitionsByImageDraft[i.id] = i.Exhibitions;
        }
        setExhibitionsByImage({ ...exhibitionsByImageDraft });
    }, [setImages]);

    const fetchArtists = useCallback(async () => {
        const artistData = await sendAuthenticatedRequest("GET", "/api/admin/artists");
        setArtists(artistData.data);
    }, [setArtists]);

    const fetchTags = useCallback(async () => {
        const tagData = await sendAuthenticatedRequest("GET", "/api/admin/tags");
        setTags(tagData.data);
    }, [setTags]);

    const fetchData = useCallback(async () => {
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
        setSelectedNavItem("Image Management");
        setTitleText("Image Management");
        if (appUser.is_admin_or_collection_manager) {
            fetchData();
        }
    }, [appUser.is_admin_or_collection_manager, fetchData, setSelectedNavItem, setTitleText]);

    const imageFilterFunction = useCallback((image) => {
        return (
            doesItemMatchSearchQuery(searchQuery, image, ["title", "valuationNotes", "otherNotes"])
        );
    }, [searchQuery]);

    const handleOpenImageAssignArtistDialog = useCallback((images) => {
        setAssignArtistDialogImages(images);
        setAssignArtistDialogIsOpen(true);
    }, []);

    const handleOpenImageAssignTagDialog = useCallback((images) => {
        setAssignTagDialogImages(images);
        setAssignTagDialogIsOpen(true);
    }, []);

    const handleOpenImagePreviewer = useCallback((image) => {
        setPreviewerImage(image);
        setPreviewerOpen(true);
    }, []);

    const handleOpenImageViewExhibitionDialog = useCallback((image) => {
        setViewImageExhibitionDialogImages([image]);
        setViewImageExhibitionDialogIsOpen(true);
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

    const handleRefresh = useCallback(() => {
        setRefreshInProgress(true);
        fetchImages();
    }, [fetchImages]);

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
            buttonAction={fetchData}
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
                handleOpenImageEditDialog,
                handleOpenImageDeleteDialog
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

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Button
                            color="primary"
                            disabled={refreshInProgress}
                            onClick={handleRefresh}
                            startIcon={<RefreshIcon />}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Refresh
                            </Typography>
                        </Button>

                        <Button
                            color="primary"
                            disabled={searchQuery === ""}
                            onClick={clearFilters}
                            startIcon={<FilterAltOffOutlinedIcon />}
                            variant="outlined"
                        >
                            <Typography variant="body1">
                                Clear Filters
                            </Typography>
                        </Button>

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

                        <Button
                            color="primary"
                            onClick={() => {
                                setDialogIsOpen(true);
                            }}
                            startIcon={<AddPhotoAlternateIcon />}
                            variant="contained"
                        >
                            <Typography variant="body1">
                                Create Images
                            </Typography>
                        </Button>
                    </Stack>
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
                        {...
                            (imagesCombinedState.visibleItems.length === imagesCombinedState.items.length && {
                                noContentMessage: "No images yet",
                                noContentButtonAction: () => { setDialogIsOpen(true); },
                                noContentButtonText: "Create an image",
                                NoContentIcon: InfoIcon
                            }) || (imagesCombinedState.visibleItems.length < imagesCombinedState.items.length && {
                                noContentMessage: "No results",
                                noContentButtonAction: clearFilters,
                                noContentButtonText: "Clear Filters",
                                NoContentIcon: SearchIcon
                            })
                        }
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
                    <SelectionSummary
                        entityPlural="images"
                        entitySingular="image"
                        items={imagesCombinedState.items}
                        selectedItems={imagesCombinedState.selectedItems}
                        setSelectedItems={setSelectedImages}
                        visibleItems={imagesCombinedState.visibleItems}
                    />

                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <Button
                            disabled={imagesCombinedState.selectedItems.length === 0}
                            onClick={() => {
                                setAssignArtistDialogImages([...imagesCombinedState.selectedItems]);
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
                                setAssignTagDialogImages([...imagesCombinedState.selectedItems]);
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
                    </Stack>
                </Stack>

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
                    primaryItems={assignArtistDialogImages}
                    refreshAllItems={fetchData}
                    secondariesByPrimary={artistsByImage}
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
                    primaryItems={assignTagDialogImages}
                    refreshAllItems={fetchData}
                    secondariesByPrimary={tagsByImage}
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
                    primaryItems={viewImageExhibitionDialogImages}
                    refreshAllItems={fetchData}
                    secondariesByPrimary={exhibitionsByImage}
                    secondaryItemsAll={exhibitions}
                    secondarySearchBoxPlaceholder="Search exhibitions by title"
                    secondarySearchFields={["title"]}
                    setDialogIsOpen={setViewImageExhibitionDialogIsOpen}
                />

            </Box>

        </ManagementPageProvider>

    );
};

export default ImageManagement;
