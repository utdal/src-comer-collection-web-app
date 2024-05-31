import { Stack, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import React from "react";
import { PersonIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { entityPropTypeShape } from "../../Classes/Entity.ts";
import { PersistentDialog } from "./PersistentDialog.js";

export const ImageFullScreenViewer = ({ image, setImage, previewerOpen, setPreviewerOpen }) => {
    const fields = [
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
        }];

    const artists = image?.Artists.sort((a, b) => {
        return a.fullNameReverse < b.fullNameReverse ? 1 : -1;
    });

    return image && (
        <PersistentDialog
            maxWidth="lg"
            open={previewerOpen}
        >

            <DialogTitle>
                {image.title}
            </DialogTitle>

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
                            {
                                (artists.length <= 1 && "Artist") ||
                            (artists.length > 1 && "Artists")
                            }
                        </Typography>

                        {(artists.length >= 1 && artists.map((a) => (
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
                        ))) || (artists.length === 0 && (
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
                        ))}
                    </Stack>

                    <Stack
                        alignItems="left"
                        direction="column"
                        height="100%"
                        spacing={2}
                    >
                        {fields.map((field) => image[field.fieldName] && (
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
                                    {
                                        image[field.fieldName]
                                    }
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={() => {
                        setPreviewerOpen(false);
                        setImage(null);
                    }}
                    variant="contained"
                >
                    Close
                </Button>
            </DialogActions>

        </PersistentDialog>
    );
};

ImageFullScreenViewer.propTypes = {
    image: PropTypes.shape(entityPropTypeShape),
    previewerOpen: PropTypes.bool.isRequired,
    setImage: PropTypes.func.isRequired,
    setPreviewerOpen: PropTypes.func.isRequired
};
