import { Stack, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import React, { useCallback } from "react";
import { PersonIcon } from "../../Imports/Icons";
import PersistentDialog from "./PersistentDialog.js";
import type { ArtistItem, DialogState, DialogStateSingleUnderlyingItem, ImageItem, Item } from "../../index.js";
import { useManagementCallbacks } from "../../ContextProviders/ManagementPageProvider.js";

interface ImageFullScreenViewerFieldDefinition {
    fieldName: string;
    displayName: string;
}

const fields: ImageFullScreenViewerFieldDefinition[] = [
    {
        fieldName: "accessionNumber",
        displayName: "Accession Number"
    },
    {
        fieldName: "year",
        displayName: "Year"
    },
    {
        fieldName: "additionalPrintYear",
        displayName: "Additional Print Year"
    },
    {
        fieldName: "medium",
        displayName: "Medium"
    },
    {
        fieldName: "edition",
        displayName: "Edition"
    },
    {
        fieldName: "condition",
        displayName: "Condition"
    },
    {
        fieldName: "valuationNotes",
        displayName: "Valuation Notes"
    },
    {
        fieldName: "other notes",
        displayName: "Other Notes"
    },
    {
        fieldName: "copyright",
        displayName: "Copyright"
    },
    {
        fieldName: "subject",
        displayName: "Subject"
    },
    {
        fieldName: "location",
        displayName: "Location"
    }
];

const ImageFullScreenViewerDialog = ({ dialogState }: {
    readonly dialogState: DialogState;
}): React.JSX.Element => {
    const { dialogIsOpen, underlyingItem } = dialogState as DialogStateSingleUnderlyingItem;
    const { closeDialogByIntent } = useManagementCallbacks();
    const image = underlyingItem as ImageItem | null;

    const artists = (image?.Artists ?? []).sort((a: Item, b: Item) => {
        return (a as ArtistItem).fullNameReverse < (b as ArtistItem).fullNameReverse ? 1 : -1;
    });

    const handleClose = useCallback(() => {
        closeDialogByIntent("image-full-screen-preview");
    }, [closeDialogByIntent]);

    return (
        <PersistentDialog
            maxWidth="lg"
            onClose={handleClose}
            open={dialogIsOpen}
        >

            <DialogTitle>
                {image?.title}
            </DialogTitle>

            {image != null
                ? (
                    <DialogContent sx={{
                        height: "100%",
                        display: "grid",
                        gridTemplateColumns: "20px 60% 30px 30% 20px",
                        gridTemplateRows: "1fr",
                        gridTemplateAreas: `
                    'paddingLeft image paddingMiddle fields paddingRight'
                `,
                        overflow: "hidden"
                    }}
                    >
                        <Stack
                            alignContent="center"
                            gridArea="image"
                            maxHeight="500px"
                        >
                            <img
                                height="100%"
                                src={`${process.env.REACT_APP_API_HOST}/api/images/${image.id}/download`}
                                style={{ objectFit: "contain" }}
                                width="auto"
                            />
                        </Stack>

                        <Stack
                            gridArea="fields"
                            overflow="auto"
                            spacing={2}
                        >
                            {/* Artists */}
                            <Stack direction="column">
                                <Typography variant="h6">
                                    {artists.length > 1 ? "Artists" : "Artist"}
                                </Typography>

                                {artists.length >= 1
                                    ? (artists as ArtistItem[]).map((a) => (
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            key={a.id}
                                        >
                                            <PersonIcon />

                                            <Typography variant="body1">
                                                {a.safe_display_name}
                                            </Typography>
                                        </Stack>
                                    ))
                                    : (
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                        >
                                            <PersonIcon opacity="0.5" />

                                            <Typography
                                                sx={{ opacity: 0.5 }}
                                                variant="body1"
                                            >
                                                No artist listed
                                            </Typography>
                                        </Stack>
                                    )}
                            </Stack>

                            <Stack
                                alignItems="left"
                                direction="column"
                                height="100%"
                                spacing={2}
                            >
                                {fields.map((field) => image[field.fieldName] != null
                                    ? (
                                        <Stack
                                            direction="column"
                                            key={field.fieldName}
                                        >
                                            <Typography variant="h6">
                                                {field.displayName}
                                            </Typography>

                                            <Typography
                                                sx={{ opacity: 0.5 }}
                                                variant="body1"
                                            >
                                                {`${image[field.fieldName] as string}`}
                                            </Typography>
                                        </Stack>
                                    )
                                    : null)}
                            </Stack>
                        </Stack>
                    </DialogContent>
                )
                : null}

            <DialogActions>
                <Button
                    onClick={handleClose}
                    variant="contained"
                >
                    Close
                </Button>
            </DialogActions>

        </PersistentDialog>
    );
};

export default ImageFullScreenViewerDialog;
