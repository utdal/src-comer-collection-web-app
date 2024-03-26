import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack,
    Button,
    Typography, Box, IconButton, Paper
} from "@mui/material";
import { Unauthorized } from "../../ErrorPages/Unauthorized.js";
import SearchBox from "../Tools/SearchBox.js";
import { FilterAltOffOutlinedIcon, RefreshIcon, EditIcon, InfoIcon, AddIcon, RemoveIcon, SearchIcon, DeleteIcon, VisibilityIcon, AddPhotoAlternateIcon, PlaceIcon, SellIcon, BrushIcon, ImageIcon, ContentCopyIcon, PhotoCameraBackIcon, PersonAddIcon, PersonRemoveIcon, CheckIcon, AccessTimeIcon, WarningIcon, LockIcon } from "../../IconImports.js";
import { ItemSingleDeleteDialog } from "../Tools/Dialogs/ItemSingleDeleteDialog.js";
import { ItemMultiCreateDialog } from "../Tools/Dialogs/ItemMultiCreateDialog.js";
import { ItemSingleEditDialog } from "../Tools/Dialogs/ItemSingleEditDialog.js";
import { DataTable } from "../Tools/DataTable.js";
import { doesItemMatchSearchQuery } from "../Tools/SearchUtilities.js";
import { Navigate } from "react-router";
import { ImageFullScreenViewer } from "../Tools/ImageFullScreenViewer.js";
import { tagFieldDefinitions } from "../Tools/HelperMethods/fields.js";
import { filterItemFields } from "../Tools/HelperMethods/fields.js";
import { EntityManageDialog } from "../Tools/Dialogs/EntityManageDialog.js";
import { imageFieldDefinitions } from "../Tools/HelperMethods/fields.js";
import { artistFieldDefinitions } from "../Tools/HelperMethods/fields.js";
import { SelectionSummary } from "../Tools/SelectionSummary.js";
import { AssociationManagementDialog } from "../Tools/Dialogs/AssociationManagementDialog.js";
import { sendAuthenticatedRequest } from "../Tools/HelperMethods/APICalls.js";
import { useSnackbar } from "../../App/AppSnackbar.js";
import { useAppUser } from "../../App/AppUser.js";
import { useTitle } from "../../App/AppTitle.js";
import { useAccountNav } from "../Account.js";
import { Image } from "../Tools/Entities/Image.js";
import { Artist } from "../Tools/Entities/Artist.js";
import { Tag } from "../Tools/Entities/Tag.js";


const ImageManagement = () => {
    const [images, setImages] = useState([]);
    const [artists, setArtists] = useState([]);
    const [tags, setTags] = useState([]);
    const [refreshInProgress, setRefreshInProgress] = useState(true);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
    const [deleteDialogImage, setDeleteDialogImage] = useState(null);

    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [editDialogImage, setEditDialogImage] = useState(null);

    const [selectedImages, setSelectedImages] = useState([]);

    const [assignArtistDialogIsOpen, setAssignArtistDialogIsOpen] = useState(false);
    const [assignArtistDialogImages, setAssignArtistDialogImages] = useState([]);
    const [artistsByImage, setArtistsByImage] = useState({});

    const [assignTagDialogIsOpen, setAssignTagDialogIsOpen] = useState(false);
    const [assignTagDialogImages, setAssignTagDialogImages] = useState([]);
    const [tagsByImage, setTagsByImage] = useState({});

    const [previewerImage, setPreviewerImage] = useState(null);
    const [previewerOpen, setPreviewerOpen] = useState(false);

    const [manageArtistDialogIsOpen, setManageArtistDialogIsOpen] = useState(false);
    const [artistDeleteDialogIsOpen, setArtistDeleteDialogIsOpen] = useState(false);
    const [artistDeleteDialogItem, setArtistDeleteDialogItem] = useState(null);
    const [artistEditDialogIsOpen, setArtistEditDialogIsOpen] = useState(false);
    const [artistEditDialogItem, setArtistEditDialogItem] = useState(null);
    const [artistDialogSearchQuery, setArtistDialogSearchQuery] = useState("");

    const [manageTagDialogIsOpen, setManageTagDialogIsOpen] = useState(false);
    const [tagDeleteDialogIsOpen, setTagDeleteDialogIsOpen] = useState(false);
    const [tagDeleteDialogItem, setTagDeleteDialogItem] = useState(null);
    const [tagEditDialogIsOpen, setTagEditDialogIsOpen] = useState(false);
    const [tagEditDialogItem, setTagEditDialogItem] = useState(null);
    const [tagDialogSearchQuery, setTagDialogSearchQuery] = useState("");

    const editDialogFieldDefinitions = imageFieldDefinitions;
    const createDialogFieldDefinitions = imageFieldDefinitions;

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const clearFilters = () => {
        setSearchQuery("");
    };


    const [, setSelectedNavItem] = useAccountNav();
    const showSnackbar = useSnackbar();
    const [appUser] = useAppUser();
    const setTitleText = useTitle();


    useEffect(() => {
        setSelectedNavItem("Image Management");
        setTitleText("Image Management");
        if (appUser.is_admin_or_collection_manager) {
            fetchData();
        }
    }, []);

    const imageFilterFunction = useCallback((image) => {
        return (
            doesItemMatchSearchQuery(searchQuery, image, ["title", "valuationNotes", "otherNotes"])
        );
    }, [searchQuery]);

    const fetchData = async() => {
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

    };

    const fetchImages = async () => {
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
    };


    const fetchArtists = async () => {
        const artistData = await sendAuthenticatedRequest("GET", "/api/admin/artists");
        setArtists(artistData.data);
    };


    const fetchTags = async () => {
        const tagData = await sendAuthenticatedRequest("GET", "/api/admin/tags");
        setTags(tagData.data);
    };


    const handleImageEdit = async (imageId, updateFields) => {
        try {
            let filteredImage = filterItemFields(imageFieldDefinitions, updateFields);
            await sendAuthenticatedRequest("PUT", `/api/admin/images/${imageId}`, filteredImage);
            await fetchImages();

            setEditDialogIsOpen(false);

            showSnackbar("Successfully edited image", "success");

        } catch (error) {

            showSnackbar("Error editing for image", "error");
            throw "ImageEditError";
        }
    };


    const handleCreateArtist = async (newArtist) => {
        try {
            let filteredArtist = filterItemFields(artistFieldDefinitions, newArtist);
            await sendAuthenticatedRequest("POST", "/api/admin/artists/", filteredArtist);
            fetchArtists();

            showSnackbar("Artist created", "success");

        } catch (error) {

            showSnackbar("Error creating artist", "error");
        }
    };



    const handleCreateTag = async (newTag) => {
        try {
            let filteredTag = filterItemFields(tagFieldDefinitions, newTag);
            await sendAuthenticatedRequest("POST", "/api/admin/tags/", filteredTag);
            fetchTags();

            showSnackbar("Tag created", "success");

        } catch (error) {

            showSnackbar("Error creating tag", "error");
        }
    };


    const handleEditArtist = async (artistId, updateFields) => {
        try {
            let filteredartist = filterItemFields(artistFieldDefinitions, updateFields);
            await sendAuthenticatedRequest("PUT", `/api/admin/artists/${artistId}`, filteredartist);
            fetchArtists();

            setArtistEditDialogIsOpen(false);
            showSnackbar("Successfully edited artist", "success");

        } catch (error) {

            showSnackbar("Error editing for artist", "error");
            throw "Error editing artist";
        }
    };



    const handleEditTag = async (tagId, updateFields) => {
        try {
            let filteredtag = filterItemFields(tagFieldDefinitions, updateFields);
            await sendAuthenticatedRequest("PUT", `/api/admin/tags/${tagId}`, filteredtag);
            fetchTags();

            setTagEditDialogIsOpen(false);

            showSnackbar("Successfully edited tag", "success");

        } catch (error) {

            showSnackbar("Error editing for tag", "error");
        }
    };


    const handleDeleteArtist = async (artistId) => {
        try {
            await sendAuthenticatedRequest("DELETE", `/api/admin/artists/${artistId}`);
            fetchArtists();

            setArtistDeleteDialogIsOpen(false);
            setArtistDeleteDialogItem(null);

            showSnackbar("Artist deleted", "success");

        } catch (error) {

            showSnackbar("Error deleting artist", "error");
        }
    };


    const handleDeleteTag = async (tagId) => {
        try {
            await sendAuthenticatedRequest("DELETE", `/api/admin/tags/${tagId}`);
            fetchTags();

            setTagDeleteDialogIsOpen(false);
            setTagDeleteDialogItem(null);

            showSnackbar(`Tag ${tagId} deleted`, "success");

        } catch (error) {

            showSnackbar(`Error deleting tag ${tagId}`, "error");
        }
    };



    const handleAssignImagesToArtist = useCallback(async (artistId, imageIds) => {
        try {
            await sendAuthenticatedRequest("PUT", "/api/admin/imageartists/assign", {
                images: imageIds,
                artists: [artistId]
            });
            showSnackbar(`Successfully assigned artist ${artistId} for ${imageIds.length} images`, "success");

        } catch (error) {
            showSnackbar(`Failed to assign artist ${artistId} for ${imageIds.length} images`, "error");
        }
        await fetchImages();
    }, [showSnackbar]);

    const handleUnassignImagesFromArtist = useCallback(async (artistId, imageIds) => {
        try {
            await sendAuthenticatedRequest("PUT", "/api/admin/imageartists/unassign", {
                images: imageIds,
                artists: [artistId]
            });
            showSnackbar(`Successfully unassigned artist ${artistId} for ${imageIds.length} images`, "success");

        } catch (error) {
            showSnackbar(`Failed to unassign artist ${artistId} for ${imageIds.length} images`, "error");
        }
        await fetchImages();
    }, [showSnackbar]);


    const handleAssignImagesToTag = useCallback(async (tagId, imageIds) => {
        try {
            await sendAuthenticatedRequest("PUT", "/api/admin/imagetags/assign", {
                images: imageIds,
                tags: [tagId]
            });
            showSnackbar(`Successfully assigned tag ${tagId} for ${imageIds.length} images`, "success");

        } catch (error) {
            showSnackbar(`Failed to assign tag ${tagId} for ${imageIds.length} images`, "error");
        }
        await fetchImages();
    }, [showSnackbar]);

    const handleUnassignImagesFromTag = useCallback(async (tagId, imageIds) => {
        try {
            await sendAuthenticatedRequest("PUT", "/api/admin/imagetags/unassign", {
                images: imageIds,
                tags: [tagId]
            });
            showSnackbar("Successfully unassigned tag", "success");

        } catch (error) {
            showSnackbar("Failed to unassign tag", "error");
        }
        await fetchImages();
    }, [showSnackbar]);




    const handleCopyToClipboard = useCallback((item, fieldName) => {
        try {
            navigator.clipboard.writeText(item[fieldName]);
            showSnackbar("Text copied to clipboard", "success");

        } catch (error) {
            showSnackbar("Error copying text to clipboard", "error");
        }
    }, []);


    const artistTableFields = [
        {
            columnDescription: "ID",
            generateTableCell: (artist) => (
                <Typography variant="body1">{artist.id}</Typography>
            ),
            generateSortableValue: (artist) => artist.id
        },
        {
            columnDescription: "Name",
            maxWidth: "300px",
            generateTableCell: (artist) => (
                <Typography variant="body1">{artist.familyName}, {artist.givenName}</Typography>
            ),
            generateSortableValue: (artist) => `${artist.familyName.toLowerCase()}, ${artist.givenName.toLowerCase()}`
        },
        {
            columnDescription: "Images",
            generateTableCell: (artist) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <ImageIcon />
                    <Typography variant="body1">{artist.Images.length}</Typography>
                </Stack>
            )
        },
        {
            columnDescription: "Website",
            generateTableCell: (artist) => (
                artist.website && (
                    <Button size="small"
                        sx={{ textTransform: "unset" }}
                        endIcon={<ContentCopyIcon />} onClick={() => {
                            handleCopyToClipboard(artist, "website");
                        }}>
                        <Typography variant="body1">{artist.website}</Typography>
                    </Button>
                )
            )
        },
        {
            columnDescription: "Notes",
            generateTableCell: (artist) => (
                artist.notes && (
                    <Typography variant="body1">{artist.notes}</Typography>
                ) || !artist.notes && (
                    <Typography variant="body1" sx={{ opacity: 0.5 }}></Typography>
                )
            )
        },
        {
            columnDescription: "Options",
            generateTableCell: (artist) => (
                <Stack direction="row">
                    <IconButton
                        onClick={() => {
                            setArtistEditDialogItem(artist);
                            setArtistEditDialogIsOpen(true);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        disabled={artist.Images.length > 0}
                        onClick={() => {
                            setArtistDeleteDialogItem(artist);
                            setArtistDeleteDialogIsOpen(true);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            )
        }
    ];



    const tagTableFields = [
        {
            columnDescription: "ID",
            generateTableCell: (tag) => (
                <Typography variant="body1">{tag.id}</Typography>
            ),
            generateSortableValue: (tag) => tag.id
        },
        {
            columnDescription: "Data",
            maxWidth: "300px",
            generateTableCell: (tag) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <SellIcon />
                    <Typography variant="body1">{tag.data}</Typography>
                </Stack>
            ),
            generateSortableValue: (tag) => tag.data.toLowerCase()
        },
        {
            columnDescription: "Images",
            generateTableCell: (tag) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <ImageIcon />
                    <Typography variant="body1">{tag.Images.length}</Typography>
                </Stack>
            )
        },
        {
            columnDescription: "Notes",
            generateTableCell: (tag) => (
                tag.notes && (
                    <Typography variant="body1">{tag.notes}</Typography>
                ) || !tag.notes && (
                    <Typography variant="body1" sx={{ opacity: 0.5 }}></Typography>
                )
            )
        },
        {
            columnDescription: "Options",
            generateTableCell: (tag) => (
                <Stack direction="row">
                    <IconButton
                        onClick={() => {
                            setTagEditDialogItem(tag);
                            setTagEditDialogIsOpen(true);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        disabled={tag.Images.length > 0}
                        onClick={() => {
                            setTagDeleteDialogItem(tag);
                            setTagDeleteDialogIsOpen(true);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            )
        }
    ];


    const imageTableFields = [
        {
            columnDescription: "ID",
            generateTableCell: (image) => (
                <Typography variant="body1">{image.id}</Typography>
            ),
            generateSortableValue: (image) => image.id
        },
        {
            columnDescription: "Title",
            generateTableCell: (image) => (
                <Typography variant="body1">{image.title}</Typography>
            ),
            generateSortableValue: (image) => image.title.toLowerCase()
        },
        {
            columnDescription: "Preview",
            generateTableCell: (image) => (
                <Stack direction="row" sx={{ height: "50px", maxWidth: "100px" }}
                    justifyContent="center" alignItems="center">
                    {(image.thumbnailUrl) && (
                        <Button
                            onClick={() => {
                                setPreviewerImage(image);
                                setPreviewerOpen(true);
                            }}
                        >
                            <img height="50px" src={`${process.env.REACT_APP_API_HOST}/api/public/images/${image.id}/download`} loading="lazy" />
                        </Button>
                    ) || image.url && (
                        <Button variant="outlined" color="primary"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                                setPreviewerImage(image);
                                setPreviewerOpen(true);
                            }}
                        >
                            <Typography variant="body1">View</Typography>
                        </Button>
                    )}
                </Stack>
            )
        },
        {
            columnDescription: "Accession Number",
            generateTableCell: (image) => (
                <Typography variant="body1">{image.accessionNumber}</Typography>
            ),
            generateSortableValue: (image) => image.accessionNumber?.toLowerCase()
        },
        {
            columnDescription: "Year",
            generateTableCell: (image) => (
                <Typography variant="body1">{image.year}</Typography>
            ),
            generateSortableValue: (image) => image.year
        },
        {
            columnDescription: "Location",
            generateTableCell: (image) => (
                image.location && (
                    <Stack direction="row" spacing={1}>
                        <PlaceIcon />
                        <Typography variant="body1">{image.location}</Typography>
                    </Stack>
                )
            )
        },
        {
            columnDescription: "Artists",
            generateTableCell: (image) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="text"
                        color="primary"
                        startIcon={<BrushIcon />}
                        onClick={() => {
                            setAssignArtistDialogImages([image]);
                            setAssignArtistDialogIsOpen(true);
                        }}
                    >
                        <Typography variant="body1">{image.Artists.length}</Typography>
                    </Button>
                </Stack>
            )
        },
        {
            columnDescription: "Tags",
            generateTableCell: (image) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="text"
                        color="primary"
                        startIcon={<SellIcon />}
                        onClick={() => {
                            setAssignTagDialogImages([image]);
                            setAssignTagDialogIsOpen(true);
                        }}
                    >
                        <Typography variant="body1">{image.Tags.length}</Typography>
                    </Button>
                </Stack>
            )
        },
        {
            columnDescription: "Exhibitions",
            generateTableCell: (image) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="text"
                        color="primary"
                        disabled startIcon={<PhotoCameraBackIcon />}
                        onClick={() => {
                            // setAssignCourseDialogUser(user);
                            // setAssignCourseDialogCourses([...user.Courses]);
                            // setAssignCourseDialogIsOpen(true);
                        }}
                    >
                        <Typography variant="body1">{image.Exhibitions.length}</Typography>
                    </Button>
                </Stack>
            )
        },
        {
            columnDescription: "Options",
            generateTableCell: (image) => (
                <Stack direction="row">
                    <IconButton
                        onClick={() => {
                            setEditDialogImage(image);
                            setEditDialogIsOpen(true);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        disabled={image.Exhibitions.length > 0}
                        onClick={() => {
                            setDeleteDialogImage(image);
                            setDeleteDialogIsOpen(true);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            )
        }
    ];


    const artistTableFieldsForDialog = useMemo(() => [
        {
            columnDescription: "ID",
            generateTableCell: (artist) => (
                <Typography variant="body1">{artist.id}</Typography>
            ),
            generateSortableValue: (artist) => artist.id
        },
        {
            columnDescription: "Artist",
            generateTableCell: (artist) => (
                <Typography variant="body1">{artist.fullNameReverse ?? `Artist ${artist.id}`}</Typography>
            )
        },
        {
            columnDescription: "Notes",
            generateTableCell: (artist) => (
                <Typography variant="body1">{artist.notes ?? ""}</Typography>
            )
        }
    ], []);


    const tagTableFieldsForDialog = useMemo(() => [
        {
            columnDescription: "ID",
            generateTableCell: (tag) => (
                <Typography variant="body1">{tag.id}</Typography>
            ),
            generateSortableValue: (tag) => tag.id
        },
        {
            columnDescription: "Tag",
            generateTableCell: (tag) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <SellIcon />
                    <Typography variant="body1">{tag.data}</Typography>
                </Stack>
            )
        },
        {
            columnDescription: "Notes",
            generateTableCell: (tag) => (
                <Typography variant="body1">{tag.notes ?? ""}</Typography>
            )
        }
    ], []);



    const artistTableFieldsForDialogAll = useMemo(() => [...artistTableFieldsForDialog, {
        columnDescription: "Add",
        generateTableCell: (artist) => {
            const quantity = artist.quantity_assigned;
            return (
                quantity == assignArtistDialogImages.length && (
                    <Button variant="text" color="primary" disabled startIcon={<CheckIcon />}>
                        {assignArtistDialogImages.length == 1 ? (
                            <Typography variant="body1">Added</Typography>
                        ) : (
                            <Typography variant="body1">
                                {quantity == 2 ? "Added to both images" : `Added to all ${quantity} images`}
                            </Typography>
                        )}
                    </Button>) ||
        quantity == 0 && (
            <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
                handleAssignImagesToArtist(artist.id, assignArtistDialogImages.map((i) => i.id));
            }}>
                {assignArtistDialogImages.length == 1 ? (
                    <Typography variant="body1">Add</Typography>
                ) : (
                    <Typography variant="body1">Add to {assignArtistDialogImages.length} images</Typography>
                )}
            </Button>
        ) ||
        quantity > 0 && quantity < assignArtistDialogImages.length && (
            <Button variant="outlined" color="primary" startIcon={<PersonAddIcon />} onClick={() => {
                handleAssignImagesToArtist(artist.id, assignArtistDialogImages.map((i) => i.id));
            }}>
                {assignArtistDialogImages.length - quantity == 1 ? (
                    <Typography variant="body1">Add to {assignArtistDialogImages.length - quantity} more image</Typography>
                ) : (
                    <Typography variant="body1">Add to {assignArtistDialogImages.length - quantity} more images</Typography>
                )}
            </Button>
        )
            );
        }
    }
    ], [assignArtistDialogImages, handleAssignImagesToArtist]);


    const tagTableFieldsForDialogAll = useMemo(() => [...tagTableFieldsForDialog, {
        columnDescription: "Add",
        generateTableCell: (tag) => {
            const quantity = tag.quantity_assigned;
            return (
                quantity == assignTagDialogImages.length && (
                    <Button variant="text" color="primary" disabled startIcon={<CheckIcon />}>
                        {assignTagDialogImages.length == 1 ? (
                            <Typography variant="body1">Added</Typography>
                        ) : (
                            <Typography variant="body1">
                                {quantity == 2 ? "Added to both images" : `Added to all ${quantity} images`}
                            </Typography>
                        )}
                    </Button>) ||
        quantity == 0 && (
            <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => {
                handleAssignImagesToTag(tag.id, assignTagDialogImages.map((i) => i.id));
            }}>
                {assignTagDialogImages.length == 1 ? (
                    <Typography variant="body1">Add</Typography>
                ) : (
                    <Typography variant="body1">Add to {assignTagDialogImages.length} images</Typography>
                )}
            </Button>
        ) ||
        quantity > 0 && quantity < assignTagDialogImages.length && (
            <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => {
                handleAssignImagesToTag(tag.id, assignTagDialogImages.map((i) => i.id));
            }}>
                {assignTagDialogImages.length - quantity == 1 ? (
                    <Typography variant="body1">Add to {assignTagDialogImages.length - quantity} more image</Typography>
                ) : (
                    <Typography variant="body1">Add to {assignTagDialogImages.length - quantity} more images</Typography>
                )}
            </Button>
        )
            );
        }
    }
    ], [assignTagDialogImages, handleAssignImagesToTag]);


    const artistTableFieldsForDialogAssigned = useMemo(() => [...artistTableFieldsForDialog, {
        columnDescription: "",
        generateTableCell: (artist) => {
            const quantity = artist.quantity_assigned;
            return (
                quantity == assignArtistDialogImages.length && (
                    <Button variant="outlined" startIcon={<PersonRemoveIcon />} onClick={() => {
                        handleUnassignImagesFromArtist(artist.id, assignArtistDialogImages.map((i) => i.id));
                    }}>
                        {assignArtistDialogImages.length == 1 ? (
                            <Typography variant="body1">Remove</Typography>
                        ) : (
                            <Typography variant="body1">Remove from {quantity} images</Typography>
                        )}
                    </Button>
                ) ||
        quantity > 0 && quantity < assignArtistDialogImages.length && (
            <Button variant="outlined" startIcon={<PersonRemoveIcon />} onClick={() => {
                handleUnassignImagesFromArtist(artist.id, assignArtistDialogImages.map((i) => i.id));
            }}>
                <Typography variant="body1">Remove from {quantity} {quantity == 1 ? "image" : "images"}</Typography>
            </Button>
        )
            );
        }
    }], [assignArtistDialogImages, handleUnassignImagesFromArtist]);



    const tagTableFieldsForDialogAssigned = useMemo(() => [...tagTableFieldsForDialog, {
        columnDescription: "",
        generateTableCell: (tag) => {
            const quantity = tag.quantity_assigned;
            return (
                quantity == assignTagDialogImages.length && (
                    <Button variant="outlined" startIcon={<RemoveIcon />} onClick={() => {
                        handleUnassignImagesFromTag(tag.id, assignTagDialogImages.map((i) => i.id));
                    }}>
                        {assignTagDialogImages.length == 1 ? (
                            <Typography variant="body1">Remove</Typography>
                        ) : (
                            <Typography variant="body1">Remove from {quantity} images</Typography>
                        )}
                    </Button>
                ) ||
        quantity > 0 && quantity < assignTagDialogImages.length && (
            <Button variant="outlined" startIcon={<RemoveIcon />} onClick={() => {
                handleUnassignImagesFromTag(tag.id, assignTagDialogImages.map((i) => i.id));
            }}>
                <Typography variant="body1">Remove from {quantity} {quantity == 1 ? "image" : "images"}</Typography>
            </Button>
        )
            );
        }
    }], [assignTagDialogImages, handleUnassignImagesFromTag]);



    const visibleImages = useMemo(() => images.filter((image) => {
        return imageFilterFunction(image);
    }), [images, searchQuery]);


    return !appUser.is_admin_or_collection_manager && (
        <Unauthorized message="Insufficient Privileges" Icon={LockIcon} buttonText="Return to Profile" buttonDestination="/Account/Profile" />
    ) || appUser.pw_change_required && (
        <Navigate to="/Account/ChangePassword" />
    ) || isError && (
        <Unauthorized message="Error loading images" Icon={WarningIcon} buttonText="Retry" buttonAction={fetchData} />
    ) || !isLoaded && (
        <Unauthorized message="Loading images..." Icon={AccessTimeIcon} />
    ) || (
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
                    <Button color="primary" variant="outlined" startIcon={<RefreshIcon />} onClick={() => {
                        setRefreshInProgress(true);
                        fetchImages();
                    }}
                    disabled={refreshInProgress}>
                        <Typography variant="body1">Refresh</Typography>
                    </Button>
                    <Button color="primary" variant="outlined" startIcon={<FilterAltOffOutlinedIcon />} onClick={clearFilters}
                        disabled={searchQuery == ""}>
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

            {!isLoaded && (
                <Unauthorized message="Loading images..." Icon={AccessTimeIcon} />
            ) || isLoaded && <DataTable items={images} visibleItems={visibleImages}
                tableFields={imageTableFields}
                rowSelectionEnabled={true}
                selectedItems={selectedImages}
                setSelectedItems={setSelectedImages}
                emptyMinHeight="300px"
                {...visibleImages.length == images.length && {
                    noContentMessage: "No images yet",
                    noContentButtonAction: () => { setDialogIsOpen(true); },
                    noContentButtonText: "Create an image",
                    NoContentIcon: InfoIcon
                } || visibleImages.length < images.length && {
                    noContentMessage: "No results",
                    noContentButtonAction: clearFilters,
                    noContentButtonText: "Clear Filters",
                    NoContentIcon: SearchIcon
                }}
            />}

            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding={2} sx={{ gridArea: "bottom" }}>
                <SelectionSummary
                    items={images}
                    selectedItems={selectedImages}
                    setSelectedItems={setSelectedImages}
                    visibleItems={visibleImages}
                    entitySingular="image"
                    entityPlural="images"
                />
                <Stack direction="row" spacing={2} >
                    <Button variant="outlined"
                        disabled={selectedImages.length == 0}
                        startIcon={<BrushIcon />}
                        onClick={() => {
                            setAssignArtistDialogImages([...selectedImages]);
                            setAssignArtistDialogIsOpen(true);
                        }}>
                        <Typography variant="body1">Manage Credits for {selectedImages.length} {selectedImages.length == 1 ? "image" : "images"}</Typography>
                    </Button>
                    <Button variant="outlined"
                        disabled={selectedImages.length == 0}
                        startIcon={<SellIcon />}
                        onClick={() => {
                            setAssignTagDialogImages([...selectedImages]);
                            setAssignTagDialogIsOpen(true);
                        }}>
                        <Typography variant="body1">Manage Tags for {selectedImages.length} {selectedImages.length == 1 ? "image" : "images"}</Typography>
                    </Button>
                </Stack>
            </Stack>

            <ItemMultiCreateDialog
                Entity={Image}
                dialogInstructions={"Add images, edit the image fields, then click 'Create'.  You can add artists and tags after you have created the images."}
                allItems={images}
                refreshAllItems={fetchImages}
                {...{ createDialogFieldDefinitions, dialogIsOpen, setDialogIsOpen }} />

            <ItemSingleEditDialog
                entity="image"
                dialogTitle={"Edit Image"}
                dialogInstructions={"Edit the image fields, then click 'Save'."}
                editDialogItem={editDialogImage}
                handleItemEdit={handleImageEdit}
                {...{ editDialogFieldDefinitions, editDialogIsOpen, setEditDialogIsOpen }} />

            <ItemSingleDeleteDialog
                entity="image"
                Entity={Image}
                allItems={images}
                setAllItems={setImages}
                dialogTitle="Delete Image"
                deleteDialogItem={deleteDialogImage}
                {...{ deleteDialogIsOpen, setDeleteDialogIsOpen }} />


            <EntityManageDialog
                Entity={Artist}
                dialogTitle="Manage Artists"
                dialogInstructionsTable="Edit or delete existing artists"
                dialogInstructionsForm="Create a new artist"
                dialogItems={artists}
                setDialogItems={setArtists}
                dialogFieldDefinitions={artistFieldDefinitions}
                dialogTableFields={artistTableFields}
                dialogIsOpen={manageArtistDialogIsOpen}
                setDialogIsOpen={setManageArtistDialogIsOpen}
                handleItemCreate={handleCreateArtist}
                handleItemEdit={handleEditArtist}
                handleItemDelete={handleDeleteArtist}
                searchBoxFields={["fullName", "fullNameReverse", "notes"]}
                searchBoxPlaceholder="Search artists by name or notes"
                internalDeleteDialogIsOpen={artistDeleteDialogIsOpen}
                setInternalDeleteDialogIsOpen={setArtistDeleteDialogIsOpen}
                internalDeleteDialogItem={artistDeleteDialogItem}
                setInternalDeleteDialogItem={setArtistDeleteDialogItem}
                internalEditDialogIsOpen={artistEditDialogIsOpen}
                setInternalEditDialogIsOpen={setArtistEditDialogIsOpen}
                internalEditDialogItem={artistEditDialogItem}
                setInternalEditDialogItem={setArtistEditDialogItem}
                itemSearchQuery={artistDialogSearchQuery}
                setItemSearchQuery={setArtistDialogSearchQuery}
            />

            <EntityManageDialog
                Entity={Tag}
                dialogTitle="Manage Tags"
                dialogInstructionsTable="Edit or delete existing tags"
                dialogInstructionsForm="Create a new tag"
                dialogItems={tags}
                setDialogItems={setTags}
                dialogFieldDefinitions={tagFieldDefinitions}
                dialogTableFields={tagTableFields}
                dialogIsOpen={manageTagDialogIsOpen}
                setDialogIsOpen={setManageTagDialogIsOpen}
                handleItemCreate={handleCreateTag}
                handleItemEdit={handleEditTag}
                handleItemDelete={handleDeleteTag}
                searchBoxFields={["data", "notes"]}
                searchBoxPlaceholder="Search tags by name or notes"
                internalDeleteDialogIsOpen={tagDeleteDialogIsOpen}
                setInternalDeleteDialogIsOpen={setTagDeleteDialogIsOpen}
                internalDeleteDialogItem={tagDeleteDialogItem}
                setInternalDeleteDialogItem={setTagDeleteDialogItem}
                internalEditDialogIsOpen={tagEditDialogIsOpen}
                setInternalEditDialogIsOpen={setTagEditDialogIsOpen}
                internalEditDialogItem={tagEditDialogItem}
                setInternalEditDialogItem={setTagEditDialogItem}
                itemSearchQuery={tagDialogSearchQuery}
                setItemSearchQuery={setTagDialogSearchQuery}
            />

            <ImageFullScreenViewer
                image={previewerImage}
                setImage={setPreviewerImage}
                previewerOpen={previewerOpen}
                setPreviewerOpen={setPreviewerOpen}
            />


            <AssociationManagementDialog
                primaryEntity="image"
                secondaryEntity="artist"
                primaryItems={assignArtistDialogImages}
                secondaryItemsAll={artists}
                secondariesByPrimary={artistsByImage}
                dialogTitle={
                    assignArtistDialogImages.length == 1 ?
                        `Edit Listed Artists for ${assignArtistDialogImages[0].title}` :
                        `Edit Listed Artists for ${assignArtistDialogImages.length} Selected Images`
                }
                dialogButtonForSecondaryManagement={<>
                    <Button variant="outlined" onClick={() => {
                        setAssignArtistDialogIsOpen(false);
                        setManageArtistDialogIsOpen(true);
                    }}>
                        <Typography>Go to artist management</Typography>
                    </Button>
                </>}
                dialogIsOpen={assignArtistDialogIsOpen}
                tableTitleAssigned={
                    assignArtistDialogImages.length == 1 ?
                        `Listed Artists for ${assignArtistDialogImages[0].title}` :
                        "Listed Artists for Selected Images"
                }
                tableTitleAll={"All Artists"}
                setDialogIsOpen={setAssignArtistDialogIsOpen}
                secondaryFieldInPrimary="Artists"
                secondaryTableFieldsAll={artistTableFieldsForDialogAll}
                secondaryTableFieldsAssignedOnly={artistTableFieldsForDialogAssigned}
                secondarySearchFields={["fullName", "fullNameReverse", "notes"]}
                secondarySearchBoxPlaceholder={"Search artists by name or notes"}
            />


            <AssociationManagementDialog
                primaryEntity="image"
                secondaryEntity="tag"
                primaryItems={assignTagDialogImages}
                secondaryItemsAll={tags}
                secondariesByPrimary={tagsByImage}
                dialogTitle={
                    assignTagDialogImages.length == 1 ?
                        `Edit Listed Tags for ${assignTagDialogImages[0].title}` :
                        `Edit Listed Tags for ${assignTagDialogImages.length} Selected Images`
                }
                dialogButtonForSecondaryManagement={<>
                    <Button variant="outlined" onClick={() => {
                        setAssignTagDialogIsOpen(false);
                        setManageTagDialogIsOpen(true);
                    }}>
                        <Typography>Go to tag management</Typography>
                    </Button>
                </>}
                dialogIsOpen={assignTagDialogIsOpen}
                tableTitleAssigned={
                    assignTagDialogImages.length == 1 ?
                        `Listed Tags for ${assignTagDialogImages[0].title}` :
                        "Listed Tags for Selected Images"
                }
                tableTitleAll={"All Tags"}
                setDialogIsOpen={setAssignTagDialogIsOpen}
                secondaryFieldInPrimary="Tags"
                secondaryTableFieldsAll={tagTableFieldsForDialogAll}
                secondaryTableFieldsAssignedOnly={tagTableFieldsForDialogAssigned}
                secondarySearchFields={["data", "notes"]}
                secondarySearchBoxPlaceholder={"Search tags by name or notes"}
            />


        </Box>

    );
};


export default ImageManagement;
