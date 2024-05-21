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
import { DataTable } from "../../Components/DataTable.js";
import { doesItemMatchSearchQuery } from "../../Helpers/SearchUtilities.js";
import { Navigate, useNavigate } from "react-router";
import { ImageFullScreenViewer } from "../../Components/Dialogs/ImageFullScreenViewer.js";
import { EntityManageDialog } from "../../Components/Dialogs/EntityManageDialog.js";
import { SelectionSummary } from "../../Components/SelectionSummary.js";
import { AssociationManagementDialog } from "../../Components/Dialogs/AssociationManagementDialog.js";
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

const imageTableFields = [
    {
        columnDescription: "ID",
        TableCellComponent: Image.TableCells.ID,
        generateSortableValue: (image) => image.id
    },
    {
        columnDescription: "Title",
        TableCellComponent: Image.TableCells.Title,
        generateSortableValue: (image) => image.title.toLowerCase()
    },
    {
        columnDescription: "Preview",
        TableCellComponent: Image.TableCells.PreviewThumbnail
    },
    {
        columnDescription: "Accession Number",
        TableCellComponent: Image.TableCells.AccessionNumber,
        generateSortableValue: (image) => image.accessionNumber?.toLowerCase()
    },
    {
        columnDescription: "Year",
        TableCellComponent: Image.TableCells.Year,
        generateSortableValue: (image) => image.year
    },
    {
        columnDescription: "Location",
        TableCellComponent: Image.TableCells.Location
    },
    {
        columnDescription: "Artists",
        TableCellComponent: Image.TableCells.ArtistCountButton
    },
    {
        columnDescription: "Tags",
        TableCellComponent: Image.TableCells.TagCountButton
    },
    {
        columnDescription: "Exhibitions",
        TableCellComponent: Image.TableCells.ImageExhibitionCountButton
    },
    {
        columnDescription: "Options",
        TableCellComponent: Image.TableCells.OptionsArray
    }
];

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
        <FullPageMessage message="Insufficient Privileges" Icon={LockIcon} buttonText="Return to Profile" buttonDestination="/Account/Profile" />
    ) || (appUser.pw_change_required &&
        <Navigate to="/Account/ChangePassword" />
    ) || (isError &&
        <FullPageMessage message="Error loading images" Icon={WarningIcon} buttonText="Retry" buttonAction={fetchData} />
    ) || (!isLoaded &&
        <FullPageMessage message="Loading images..." Icon={AccessTimeIcon} />
    ) || (
        <ManagementPageProvider
            itemsCombinedState={imagesCombinedState}
            setItems={setImages}
            setSelectedItems={setSelectedImages}
            managementCallbacks={{
                handleOpenImageAssignArtistDialog,
                handleOpenImageAssignTagDialog,
                handleOpenImageViewExhibitionDialog,
                handleOpenImagePreviewer,
                handleOpenImageEditDialog,
                handleOpenImageDeleteDialog
            }}
        >
            <Box component={Paper} square={true} sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "80px calc(100vh - 224px) 80px",
                gridTemplateAreas: `
                    "top"
                    "table"
                    "bottom"
                `
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "top" }}>
                    <SearchBox {...{ searchQuery, setSearchQuery }} placeholder="Search image fields and notes" width="30%" />
                    <Stack direction="row" spacing={2}>
                        <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}
                            disabled={refreshInProgress}>
                            <Typography variant="body1">Refresh</Typography>
                        </Button>
                        <Button color="primary" variant="outlined" startIcon={<FilterAltOffOutlinedIcon />} onClick={clearFilters}
                            disabled={searchQuery === ""}>
                            <Typography variant="body1">Clear Filters</Typography>
                        </Button>
                        <Button color="primary" variant="outlined" startIcon={<SellIcon />}
                            onClick={() => {
                                setManageTagDialogIsOpen(true);
                            }}
                        >
                            <Typography variant="body1">Tags</Typography>
                        </Button>
                        <Button color="primary" variant="outlined" startIcon={<BrushIcon />}
                            onClick={() => {
                                setManageArtistDialogIsOpen(true);
                            }}
                        >
                            <Typography variant="body1">Artists</Typography>
                        </Button>
                        <Button color="primary" variant="contained" startIcon={<AddPhotoAlternateIcon />}
                            onClick={() => {
                                setDialogIsOpen(true);
                            }}
                        >
                            <Typography variant="body1">Create Images</Typography>
                        </Button>
                    </Stack>
                </Stack>

                {(!isLoaded &&
                    <FullPageMessage message="Loading images..." Icon={AccessTimeIcon} />
                ) || (isLoaded && <DataTable items={imagesCombinedState.items} visibleItems={imagesCombinedState.visibleItems}
                    tableFields={imageTableFields}
                    rowSelectionEnabled={true}
                    selectedItems={imagesCombinedState.selectedItems}
                    setSelectedItems={setSelectedImages}
                    emptyMinHeight="300px"
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
                />)}

                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "bottom" }}>
                    <SelectionSummary
                        items={imagesCombinedState.items}
                        selectedItems={imagesCombinedState.selectedItems}
                        setSelectedItems={setSelectedImages}
                        visibleItems={imagesCombinedState.visibleItems}
                        entitySingular="image"
                        entityPlural="images"
                    />
                    <Stack direction="row" spacing={2} >
                        <Button variant="outlined"
                            disabled={imagesCombinedState.selectedItems.length === 0}
                            startIcon={<BrushIcon />}
                            onClick={() => {
                                setAssignArtistDialogImages([...imagesCombinedState.selectedItems]);
                                setAssignArtistDialogIsOpen(true);
                            }}>
                            <Typography variant="body1">Manage Credits for {imagesCombinedState.selectedItems.length} {imagesCombinedState.selectedItems.length === 1 ? "image" : "images"}</Typography>
                        </Button>
                        <Button variant="outlined"
                            disabled={imagesCombinedState.selectedItems.length === 0}
                            startIcon={<SellIcon />}
                            onClick={() => {
                                setAssignTagDialogImages([...imagesCombinedState.selectedItems]);
                                setAssignTagDialogIsOpen(true);
                            }}>
                            <Typography variant="body1">Manage Tags for {imagesCombinedState.selectedItems.length} {imagesCombinedState.selectedItems.length === 1 ? "image" : "images"}</Typography>
                        </Button>
                    </Stack>
                </Stack>

                <ItemMultiCreateDialog
                    Entity={Image}
                    dialogInstructions={"Add images, edit the image fields, then click 'Create'.  You can add artists and tags after you have created the images."}
                    allItems={imagesCombinedState.items}
                    refreshAllItems={fetchImages}
                    {...{ dialogIsOpen, setDialogIsOpen }} />

                <ItemSingleEditDialog
                    Entity={Image}
                    editDialogItem={editDialogImage}
                    refreshAllItems={fetchImages}
                    {...{ editDialogIsOpen, setEditDialogIsOpen }} />

                <ItemSingleDeleteDialog
                    entity="image"
                    Entity={Image}
                    allItems={imagesCombinedState.items}
                    setAllItems={setImages}
                    dialogTitle="Delete Image"
                    deleteDialogItem={deleteDialogImage}
                    {...{ deleteDialogIsOpen, setDeleteDialogIsOpen }} />

                <EntityManageDialog
                    Entity={Artist}
                    dialogItemsCombinedState={artistsCombinedState}
                    setDialogItems={setArtists}
                    filterDialogItems={filterArtists}
                    dialogIsOpen={manageArtistDialogIsOpen}
                    setDialogIsOpen={setManageArtistDialogIsOpen}
                    searchBoxPlaceholder="Search artists by name or notes"
                    refreshAllItems={fetchArtists}
                />

                <EntityManageDialog
                    Entity={Tag}
                    dialogItemsCombinedState={tagsCombinedState}
                    setDialogItems={setTags}
                    filterDialogItems={filterTags}
                    dialogIsOpen={manageTagDialogIsOpen}
                    setDialogIsOpen={setManageTagDialogIsOpen}
                    searchBoxPlaceholder="Search tags by name or notes"
                    refreshAllItems={fetchTags}
                />

                <ImageFullScreenViewer
                    image={previewerImage}
                    setImage={setPreviewerImage}
                    previewerOpen={previewerOpen}
                    setPreviewerOpen={setPreviewerOpen}
                />

                <AssociationManagementDialog
                    Association={ImageArtist}
                    editMode={true}
                    primaryItems={assignArtistDialogImages}
                    secondaryItemsAll={artistsCombinedState.items}
                    secondariesByPrimary={artistsByImage}
                    dialogButtonForSecondaryManagement={<>
                        <Button variant="outlined" onClick={() => {
                            setAssignArtistDialogIsOpen(false);
                            setManageArtistDialogIsOpen(true);
                        }}>
                            <Typography>Go to artist management</Typography>
                        </Button>
                    </>}
                    dialogIsOpen={assignArtistDialogIsOpen}
                    setDialogIsOpen={setAssignArtistDialogIsOpen}
                    secondaryFieldInPrimary="Artists"
                    secondarySearchFields={["fullName", "fullNameReverse", "notes"]}
                    secondarySearchBoxPlaceholder={"Search artists by name or notes"}
                    refreshAllItems={fetchData}
                />

                <AssociationManagementDialog
                    Association={ImageTag}
                    editMode={true}
                    primaryItems={assignTagDialogImages}
                    secondaryItemsAll={tagsCombinedState.items}
                    secondariesByPrimary={tagsByImage}
                    dialogButtonForSecondaryManagement={<>
                        <Button variant="outlined" onClick={() => {
                            setAssignTagDialogIsOpen(false);
                            setManageTagDialogIsOpen(true);
                        }}>
                            <Typography>Go to tag management</Typography>
                        </Button>
                    </>}
                    dialogIsOpen={assignTagDialogIsOpen}
                    setDialogIsOpen={setAssignTagDialogIsOpen}
                    secondaryFieldInPrimary="Tags"
                    secondarySearchFields={["data", "notes"]}
                    secondarySearchBoxPlaceholder={"Search tags by name or notes"}
                    refreshAllItems={fetchData}
                />

                <AssociationManagementDialog
                    Association={ImageExhibition}
                    editMode={false}
                    primaryItems={viewImageExhibitionDialogImages}
                    secondaryItemsAll={exhibitions}
                    secondariesByPrimary={exhibitionsByImage}
                    refreshAllItems={fetchData}
                    dialogButtonForSecondaryManagement={<>
                        <Button variant="outlined" onClick={() => {
                            navigate("/Account/Admin/Exhibitions");
                        }}>
                            <Typography>Go to exhibition management</Typography>
                        </Button>
                    </>}
                    dialogIsOpen={viewImageExhibitionDialogIsOpen}
                    setDialogIsOpen={setViewImageExhibitionDialogIsOpen}
                    secondarySearchFields={["title"]}
                    secondarySearchBoxPlaceholder="Search exhibitions by title"
                />

            </Box>

        </ManagementPageProvider>

    );
};

export default ImageManagement;
