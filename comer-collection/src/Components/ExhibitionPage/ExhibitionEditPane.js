import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { getImageStateById } from "./exhibitionEditReducer.js";
import {
    CloudUploadIcon,
    AddPhotoAlternateIcon,
    DeleteIcon,
    CollectionsIcon,
    SecurityIcon
} from "../../Imports/Icons.js";
import { useAppUser } from "../../Hooks/useAppUser.js";
import PropTypes from "prop-types";
import { ColorInput } from "./ColorInput.js";
import { AccordionSubHeading } from "./AccordionSubHeading.js";
import { ExhibitionOption } from "./ExhibitionOption.js";
import { ExhibitionOptionGroup } from "./ExhibitionOptionGroup.js";
import { ImageRearrangeDialog } from "./ImageRearrangeDialog.js";
import { ImageChooserDialog } from "./ImageChooserDialog.js";
import { exhibitionStatePropTypesShape } from "../../Classes/Entities/Exhibition.js";
import { entityPropTypeShape } from "../../Classes/Entity.js";

const moodinessOptions = [
    {
        value: "dark",
        displayText: "Dark"
    },
    {
        value: "moody dark",
        displayText: "Moody dark"
    },
    {
        value: "moody bright",
        displayText: "Moody bright"
    },
    {
        value: "bright",
        displayText: "Bright"
    }
];

export const directionOptions = [
    {
        value: 1,
        displayText: "Front"
    },
    {
        value: 2,
        displayText: "Right"
    },
    {
        value: 3,
        displayText: "Back"
    },
    {
        value: 4,
        displayText: "Left"
    }
];

const textureOptions = [
    {
        value: "black_carpet.png",
        displayText: "Black Carpet"
    },
    {
        value: "black_marble.png",
        displayText: "Black Marble"
    },
    {
        value: "blue_carpet.png",
        displayText: "Blue Carpet"
    },
    {
        value: "dark_gray_carpet.png",
        displayText: "Dark Gray Carpet"
    },
    {
        value: "gray_marble.png",
        displayText: "Gray Marble"
    },
    {
        value: "orange_carpet.png",
        displayText: "Orange Carpet"
    },
    {
        value: "parquet_wood.jpg",
        displayText: "Parquet Wood"
    }
];

export const getSwappedImageArray = (images, imageIdA, imageIdB) => {
    const imageA = images.find((image) => image.image_id === imageIdA);
    const imageB = images.find((image) => image.image_id === imageIdB);
    if (!imageA || !imageB) { return images; }

    return images.map((image) => {
        switch (image.image_id) {
        case imageIdA:
            return imageB;
        case imageIdB:
            return imageA;
        default:
            return image;
        }
    });
};

export const ExhibitionEditPane = ({ exhibitionMetadata, exhibitionState, exhibitionEditDispatch, globalImageCatalog, saveExhibition }) => {
    const [expandedSection, setExpandedSection] = useState(null);

    const [selectedImageId, setSelectedImageId] = useState(null);

    const [imageChooserIsOpen, setImageChooserIsOpen] = useState(false);
    const [imageRearrangerIsOpen, setImageRearrangerIsOpen] = useState(false);

    const [deleteImageDialogIsOpen, setDeleteImageDialogIsOpen] = useState(false);

    const theme = useTheme();
    const appUser = useAppUser();

    useEffect(() => {
        const saveInterval = setInterval(saveExhibition, 30000);
        return () => {
            clearInterval(saveInterval);
        };
    });

    return (

        <Box
            component={Paper}
            square
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "60px calc(100vh - 184px) 60px",
                gridTemplateAreas: `
                    "header"
                    "accordions"
                    "footer"
                `,
                zIndex: 50
            }}
        >

            <Box
                padding={2}
                sx={{
                    gridArea: "header",
                    backgroundColor: theme.palette.grey.veryTranslucent
                }}
            >
                <Typography
                    align="center"
                    variant="h5"
                >
                    {exhibitionMetadata.title}
                </Typography>
            </Box>

            <Box sx={{ gridArea: "accordions", overflowY: "scroll" }} >

                <ExhibitionOptionGroup
                    description="Exhibition Settings"
                    expandedSection={expandedSection}
                    id="exhibition_settings"
                    setExpandedSection={setExpandedSection}
                >
                    <AccordionSubHeading text="Room Appearance" />

                    <ExhibitionOption description="Main Wall Color">
                        <ColorInput
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_main_wall_color",
                                    newColor: e.target.value
                                }
                                );
                            }}
                            value={exhibitionState.appearance.main_wall_color}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption description="Side Wall Color">
                        <ColorInput
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_side_wall_color",
                                    newColor: e.target.value
                                }
                                );
                            }}
                            value={exhibitionState.appearance.side_wall_color}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption description="Floor Color">
                        <ColorInput
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_floor_color",
                                    newColor: e.target.value
                                }
                                );
                            }}
                            value={exhibitionState.appearance.floor_color}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption description="Ceiling Color">
                        <ColorInput
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_ceiling_color",
                                    newColor: e.target.value
                                }
                                );
                            }}
                            value={exhibitionState.appearance.ceiling_color}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption description="Floor Texture">
                        <Select
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_floor_texture",
                                    newTexture: e.target.value
                                });
                            }}
                            value={exhibitionState.appearance.floor_texture ?? ""}
                        >
                            {textureOptions.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.displayText}
                                </MenuItem>
                            ))}
                        </Select>
                    </ExhibitionOption>

                    <AccordionSubHeading text="Ambient Lighting" />

                    <ExhibitionOption description="Moodiness">
                        <Select
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_moodiness",
                                    newMoodiness: e.target.value
                                });
                            }}
                            value={exhibitionState.appearance.moodiness ?? ""}
                        >
                            {moodinessOptions.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.displayText}
                                </MenuItem>
                            ))}
                        </Select>
                    </ExhibitionOption>

                    <ExhibitionOption description="Ambient Light Color">
                        <ColorInput
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_ambient_light_color",
                                    newColor: e.target.value
                                }
                                );
                            }}
                            value={exhibitionState.appearance.ambient_light_color}
                        />
                    </ExhibitionOption>

                    <AccordionSubHeading text="Exhibition Dimensions" />

                    <ExhibitionOption description="Length">
                        <Input
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_length",
                                    newValue: e.target.value
                                });
                            }}
                            type="number"
                            value={exhibitionState.size.length_ft ?? 0}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption description="Width">
                        <Input
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_width",
                                    newValue: e.target.value
                                });
                            }}
                            type="number"
                            value={exhibitionState.size.width_ft ?? 0}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption description="Height">
                        <Input
                            onChange={(e) => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_height",
                                    newValue: e.target.value
                                });
                            }}
                            type="number"
                            value={exhibitionState.size.height_ft ?? 0}
                        />
                    </ExhibitionOption>

                </ExhibitionOptionGroup>

                <ExhibitionOptionGroup
                    description="Image Settings"
                    expandedSection={expandedSection}
                    id="image_settings"
                    selectedImageId={selectedImageId}
                    setExpandedSection={setExpandedSection}
                    setSelectedImageId={setSelectedImageId}
                >

                    <ExhibitionOption>

                        <Button
                            fullWidth
                            onClick={() => {
                                setImageChooserIsOpen(true);
                            }}
                            startIcon={<AddPhotoAlternateIcon />}
                            variant="contained"
                        >
                            Add Image
                        </Button>
                    </ExhibitionOption>

                    <ExhibitionOption>

                        <Button
                            fullWidth
                            onClick={() => {
                                setImageRearrangerIsOpen(true);
                            }}
                            startIcon={<CollectionsIcon />}
                            variant="outlined"
                        >
                            Rearrange Images
                        </Button>

                    </ExhibitionOption>

                    <ExhibitionOption>

                        <Select
                            disabled={!exhibitionState.images?.length}
                            onChange={(e) => {
                                setSelectedImageId(e.target.value);
                            }}
                            sx={{ width: "100%", minHeight: "70px" }}
                            value={selectedImageId ?? ""}
                        >
                            {(exhibitionState.images ?? []).map((image) => {
                                const catalogImage = globalImageCatalog?.find((i) => i.id === image.image_id);
                                const imageTitle = catalogImage?.title;
                                return (
                                    <MenuItem
                                        key={image.image_id}
                                        value={image.image_id ?? ""}
                                    >
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            spacing={1}
                                        >
                                            <Box
                                                height="40px"
                                                sx={{
                                                    backgroundImage: `url("${catalogImage?.thumbnailUrl}")`,
                                                    backgroundSize: "contain",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundPosition: "center"
                                                }}
                                                width="40px"
                                            />

                                            <Typography>
                                                {imageTitle}
                                            </Typography>
                                        </Stack>
                                    </MenuItem>
                                );
                            })}
                        </Select>

                        <IconButton
                            disabled={!selectedImageId}
                            onClick={() => {
                                setDeleteImageDialogIsOpen(true);
                            }}
                            variant="contained"
                        >
                            <DeleteIcon />
                        </IconButton>

                    </ExhibitionOption>

                    { selectedImageId
                        ? (
                            <>
                                <AccordionSubHeading text="Position" />

                                <ExhibitionOption description="Wall">
                                    <Select
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_direction",
                                                newValue: e.target.value
                                            });
                                        }}
                                        value={getImageStateById(exhibitionState, selectedImageId)?.metadata.direction ?? ""}
                                    >
                                        {directionOptions.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.displayText}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                </ExhibitionOption>

                                <ExhibitionOption description="Custom Position">

                                    <Checkbox
                                        checked={Boolean(getImageStateById(exhibitionState, selectedImageId)?.position.custom_position)}
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_position_custom_enabled",
                                                isEnabled: e.target.checked
                                            });
                                        }}
                                    />

                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId)?.position.custom_position}
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_position_custom_x",
                                                newValue: e.target.value
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId)?.position.custom_x ?? ""}
                                    />

                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId)?.position.custom_position}
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_position_custom_y",
                                                newValue: e.target.value
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId)?.position.custom_y ?? ""}
                                    />

                                </ExhibitionOption>

                                <AccordionSubHeading text="Matte" />

                                <ExhibitionOption description="Color">
                                    <ColorInput
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_matte_color",
                                                newColor: e.target.value
                                            }
                                            );
                                        }}
                                        value={getImageStateById(exhibitionState, selectedImageId)?.matte.color}
                                    />

                                </ExhibitionOption>

                                <ExhibitionOption description="Custom Weight">

                                    <Checkbox
                                        checked={Boolean(getImageStateById(exhibitionState, selectedImageId)?.matte.weighted)}
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_matte_weight_enabled",
                                                isEnabled: e.target.checked
                                            });
                                        }}
                                    />

                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId)?.matte.weighted}
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_matte_weight_value",
                                                newValue: e.target.value
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId)?.matte.weighted_value ?? ""}
                                    />
                                </ExhibitionOption>

                                <AccordionSubHeading text="Frame" />

                                <ExhibitionOption description="Custom Frame">
                                    <Checkbox
                                        checked={Boolean(getImageStateById(exhibitionState, selectedImageId)?.frame.custom)}
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_frame_custom_enabled",
                                                isEnabled: e.target.checked
                                            });
                                        }}
                                    />

                                </ExhibitionOption>

                                <ExhibitionOption description="Color">
                                    <ColorInput
                                        disabled={!getImageStateById(exhibitionState, selectedImageId)?.frame.custom}
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_frame_color",
                                                newColor: e.target.value
                                            }
                                            );
                                        }}
                                        value={getImageStateById(exhibitionState, selectedImageId)?.frame.color}
                                    />

                                </ExhibitionOption>

                                <ExhibitionOption description="Width">
                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId)?.frame.custom}
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_frame_width",
                                                newValue: e.target.value
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId)?.frame.width ?? ""}
                                    />
                                </ExhibitionOption>

                                <ExhibitionOption description="Height">
                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId)?.frame.custom}
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_frame_height",
                                                newValue: e.target.value
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId)?.frame.height ?? ""}
                                    />
                                </ExhibitionOption>

                                <AccordionSubHeading text="Spotlight" />

                                <ExhibitionOption description="Color">
                                    <ColorInput
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_light_color",
                                                newColor: e.target.value
                                            }
                                            );
                                        }}
                                        value={getImageStateById(exhibitionState, selectedImageId)?.light.color}
                                    />
                                </ExhibitionOption>

                                <ExhibitionOption description="Intensity">
                                    <Input
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_light_intensity",
                                                newValue: e.target.value
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId)?.light.intensity ?? ""}
                                    />
                                </ExhibitionOption>

                                <AccordionSubHeading text="Curator's Notes" />

                                <ExhibitionOption
                                    description="Description"
                                    vertical
                                >
                                    <TextField
                                        multiline
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_description",
                                                newValue: e.target.value
                                            });
                                        }}
                                        placeholder="Enter text"
                                        rows={4}
                                        type="textarea"
                                        value={getImageStateById(exhibitionState, selectedImageId)?.metadata.description ?? ""}
                                        variant="outlined"
                                    />
                                </ExhibitionOption>

                                <ExhibitionOption
                                    description="Additional Information"
                                    vertical
                                >
                                    <TextField
                                        multiline
                                        onChange={(e) => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_additional_information",
                                                newValue: e.target.value
                                            });
                                        }}
                                        placeholder="Enter text"
                                        rows={2}
                                        type="textarea"
                                        value={getImageStateById(exhibitionState, selectedImageId)?.metadata.additional_information ?? ""}
                                        variant="outlined"
                                    />
                                </ExhibitionOption>
                            </>
                        )
                        : null}

                </ExhibitionOptionGroup>

            </Box>

            <Stack
                alignItems="center"
                direction="row"
                justifyContent="center"
                sx={{
                    width: "100%",
                    height: "100%",
                    gridArea: "footer",
                    backgroundColor: theme.palette.grey.veryTranslucent
                }}
            >

                <Button
                    color={
                        appUser.is_admin && appUser.id !== exhibitionMetadata.exhibition_owner ? "secondary" : "primary"
                    }
                    onClick={saveExhibition}
                    startIcon={
                        appUser.is_admin && appUser.id !== exhibitionMetadata.exhibition_owner ? <SecurityIcon /> : <CloudUploadIcon />
                    }
                    variant="contained"
                >
                    Save
                </Button>

            </Stack>

            <ImageChooserDialog
                exhibitionEditDispatch={exhibitionEditDispatch}
                exhibitionState={exhibitionState}
                globalImageCatalog={globalImageCatalog}
                imageChooserIsOpen={imageChooserIsOpen}
                setImageChooserIsOpen={setImageChooserIsOpen}
                setSelectedImageId={setSelectedImageId}
            />

            <ImageRearrangeDialog
                exhibitionEditDispatch={exhibitionEditDispatch}
                exhibitionState={exhibitionState}
                globalImageCatalog={globalImageCatalog}
                imageRearrangerIsOpen={imageRearrangerIsOpen}
                setImageRearrangerIsOpen={setImageRearrangerIsOpen}
            />

            <Dialog
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    exhibitionEditDispatch({
                        scope: "exhibition",
                        type: "remove_image",
                        image_id: selectedImageId
                    });
                    setDeleteImageDialogIsOpen(false);
                    setSelectedImageId(null);
                }}
                open={deleteImageDialogIsOpen}
                sx={{ zIndex: 10000 }}
            >
                <DialogTitle>
                    Remove image
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        Are you sure you want to remove this image?
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={1}
                        width="100%"
                    >
                        <Button
                            onClick={() => {
                                setDeleteImageDialogIsOpen(false);
                            }}
                            variant="outlined"
                        >
                            <Typography>
                                Cancel
                            </Typography>
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                            >
                                <DeleteIcon />

                                <Typography>
                                    Remove
                                </Typography>
                            </Stack>
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

ExhibitionEditPane.propTypes = {
    exhibitionEditDispatch: PropTypes.func.isRequired,
    exhibitionMetadata: exhibitionStatePropTypesShape.isRequired,
    exhibitionState: PropTypes.shape(exhibitionStatePropTypesShape).isRequired,
    globalImageCatalog: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    saveExhibition: PropTypes.func.isRequired
};
