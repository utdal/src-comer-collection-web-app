/* eslint-disable react/prop-types */
import { Entity } from "../Entity.js";
import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { BrushIcon, PhotoCameraBackIcon, PlaceIcon, VisibilityIcon } from "../../Imports/Icons.js";
import { useAppUser } from "../../ContextProviders/AppUser.js";
import { useTableRowItem } from "../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";

class Image extends Entity {
    static baseUrl = "/api/admin/images";
    static singular = "image";
    static plural = "images";

    static fieldDefinitions = [
        {
            fieldName: "title",
            displayName: "Image Title",
            isRequired: true
        },
        {
            fieldName: "accessionNumber",
            displayName: "Accession Number",
            isRequired: false
        },
        {
            fieldName: "year",
            displayName: "Year",
            isRequired: false,
            inputType: "number"
        },
        {
            fieldName: "additionalPrintYear",
            displayName: "Additional Print Year",
            isRequired: false,
            inputType: "number"
        },
        {
            fieldName: "url",
            displayName: "URL",
            inputType: "url",
            multiline: true,
            blank: "https://atecquilt01.utdallas.edu/comer/public/images/"
        },
        {
            fieldName: "thumbnailUrl",
            displayName: "Thumbnail URL",
            inputType: "url",
            multiline: true,
            blank: "https://atecquilt01.utdallas.edu/comer/public/images/"
        },
        {
            fieldName: "medium",
            displayName: "Medium",
            isRequired: false
        },
        {
            fieldName: "width",
            displayName: "Image Width",
            isRequired: true,
            inputType: "number"
        },
        {
            fieldName: "height",
            displayName: "Image Height",
            isRequired: true,
            inputType: "number"
        },
        {
            fieldName: "matWidth",
            displayName: "Mat Width",
            inputType: "number"
        },
        {
            fieldName: "matHeight",
            displayName: "Mat Height",
            inputType: "number"
        },
        {
            fieldName: "copyright",
            displayName: "Copyright",
            inputType: "textarea",
            multiline: true
        },
        {
            fieldName: "location",
            displayName: "Location",
            isRequired: false
        },
        {
            fieldName: "subject",
            displayName: "Subject",
            inputType: "textarea",
            multiline: true
        },
        {
            fieldName: "condition",
            displayName: "Condition",
            inputType: "textarea"
        },
        {
            fieldName: "valuationNotes",
            displayName: "Valuation Notes",
            inputType: "textarea",
            multiline: true
        },
        {
            fieldName: "otherNotes",
            displayName: "Other Notes",
            inputType: "textarea",
            multiline: true
        }
    ];

    static TableCells = {
        ID () {
            const image = useTableRowItem();
            return (
                <Typography variant="body1">{image.id}</Typography>
            );
        },
        Title () {
            const image = useTableRowItem();
            return (
                <Typography variant="body1">{image.title}</Typography>
            );
        },
        PreviewThumbnail () {
            const image = useTableRowItem();
            const { handleOpenImagePreviewer } = useManagementCallbacks();
            const handleOpenPreviewer = useCallback(() => {
                handleOpenImagePreviewer(image);
            }, [handleOpenImagePreviewer, image]);
            return (
                <Stack direction="row" sx={{ height: "50px", maxWidth: "100px" }}
                    justifyContent="center" alignItems="center">
                    {(image.thumbnailUrl &&
                        <Button onClick={handleOpenPreviewer} >
                            <img height="50px" src={`${process.env.REACT_APP_API_HOST}/api/public/images/${image.id}/download`} loading="lazy" />
                        </Button>
                    ) || (image.url &&
                        <Button variant="outlined" color="primary"
                            startIcon={<VisibilityIcon />}
                            onClick={handleOpenPreviewer}
                        >
                            <Typography variant="body1">View</Typography>
                        </Button>
                    )}
                </Stack>
            );
        },
        AccessionNumber () {
            const image = useTableRowItem();
            return (
                <Typography variant="body1">{image.accessionNumber}</Typography>
            );
        },
        Year () {
            const image = useTableRowItem();
            return (
                <Typography variant="body1">{image.year}</Typography>
            );
        },
        Location () {
            const image = useTableRowItem();
            return (
                image.location && (
                    <Stack direction="row" spacing={1}>
                        <PlaceIcon />
                        <Typography variant="body1">{image.location}</Typography>
                    </Stack>
                )
            );
        },
        ArtistCountButton () {
            const image = useTableRowItem();
            const { handleOpenImageAssignArtistDialog } = useManagementCallbacks();
            const handleOpenAssignArtistDialog = useCallback(() => {
                handleOpenImageAssignArtistDialog([image]);
            }, [handleOpenImageAssignArtistDialog, image]);
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="text"
                        color="primary"
                        startIcon={<BrushIcon />}
                        onClick={handleOpenAssignArtistDialog}
                    >
                        <Typography variant="body1">{image.Artists.length}</Typography>
                    </Button>
                </Stack>
            );
        },
        TagCountButton () {
            const image = useTableRowItem();
            const { handleOpenImageAssignTagDialog } = useManagementCallbacks();
            const handleOpenAssignTagDialog = useCallback(() => {
                handleOpenImageAssignTagDialog([image]);
            }, [handleOpenImageAssignTagDialog, image]);
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="text"
                        color="primary"
                        startIcon={<BrushIcon />}
                        onClick={handleOpenAssignTagDialog}
                    >
                        <Typography variant="body1">{image.Tags.length}</Typography>
                    </Button>
                </Stack>
            );
        },
        ImageExhibitionCountButton () {
            const image = useTableRowItem();
            const [appUser] = useAppUser();
            const { handleOpenImageViewExhibitionDialog } = useManagementCallbacks();
            const handleOpenViewExhibitionDialog = useCallback(() => {
                handleOpenImageViewExhibitionDialog([image]);
            }, [handleOpenImageViewExhibitionDialog, image]);
            return (
                <Stack direction="row" spacing={1}>
                    <Button variant="text" sx={{ textTransform: "unset" }}
                        color="primary"
                        startIcon={<PhotoCameraBackIcon />}
                        disabled={!appUser.is_admin}
                        onClick={handleOpenViewExhibitionDialog}
                    >
                        <Typography variant="body1">{image.Exhibitions.length}</Typography>
                    </Button>
                </Stack>
            );
        },
        EditButton () {
            const image = useTableRowItem();
            const { handleOpenImageEditDialog } = useManagementCallbacks();
            const handleOpenEditDialog = useCallback(() => {
                handleOpenImageEditDialog(image);
            }, [image, handleOpenImageEditDialog]);
            return (
                <Entity.TableCells.EditButton onClick={handleOpenEditDialog} />
            );
        },
        DeleteButton () {
            const image = useTableRowItem();
            const { handleOpenImageDeleteDialog } = useManagementCallbacks();
            const handleOpenDeleteDialog = useCallback(() => {
                handleOpenImageDeleteDialog(image);
            }, [image, handleOpenImageDeleteDialog]);
            return (
                <Entity.TableCells.DeleteButton
                    disabled={image.Exhibitions.length > 0}
                    onClick={handleOpenDeleteDialog} />
            );
        },
        OptionsArray () {
            return (
                <>
                    <Image.TableCells.EditButton />
                    <Image.TableCells.DeleteButton />
                </>
            );
        }
    };
}

export { Image };
