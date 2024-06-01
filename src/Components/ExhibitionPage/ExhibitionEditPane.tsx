import type { SelectChangeEvent } from "@mui/material";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getImageStateById } from "./exhibitionEditReducer";
import {
    CloudUploadIcon,
    AddPhotoAlternateIcon,
    DeleteIcon,
    CollectionsIcon,
    SecurityIcon
} from "../../Imports/Icons.js";
import useAppUser from "../../Hooks/useAppUser";
import ColorInput from "./ColorInput";
import AccordionSubHeading from "./AccordionSubHeading";
import ExhibitionOption from "./ExhibitionOption";
import ExhibitionOptionGroup from "./ExhibitionOptionGroup";
import { ImageRearrangeDialog } from "./ImageRearrangeDialog";
import ImageChooserDialog from "./ImageChooserDialog";
import type { ExhibitionData, ExhibitionDispatchAction, ExhibitionImageData, ExhibitionImageDirectionIdentifier, ExhibitionMetadata } from "./ExhibitionDispatchActionTypes";
import type { ImageItem } from "../..";
import styled from "@emotion/styled";

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

type TextureValue = string;

interface TextureOption {
    value: TextureValue;
    displayText: string;
}

const textureOptions: TextureOption[] = [
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

export const getSwappedImageArray = (images: ExhibitionImageData[], imageIdA: number, imageIdB: number): ExhibitionImageData[] => {
    const imageA = images.find((image) => image.image_id === imageIdA);
    const imageB = images.find((image) => image.image_id === imageIdB);
    if (!imageA || !imageB) {
        return images;
    }

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

interface ExhibitionEditPaneComponentProps {
    readonly exhibitionMetadata: ExhibitionMetadata;
    readonly exhibitionState: ExhibitionData;
    readonly exhibitionEditDispatch: React.Dispatch<ExhibitionDispatchAction>;
    readonly globalImageCatalog: ImageItem[];
    readonly saveExhibition: () => void;
}

const StyledHeader = styled(Box)(() => ({
    gridArea: "header",
    backgroundColor: "gray"
}));

export const ExhibitionEditPane = ({ exhibitionMetadata, exhibitionState, exhibitionEditDispatch, globalImageCatalog, saveExhibition }: ExhibitionEditPaneComponentProps): React.JSX.Element => {
    const [expandedSection, setExpandedSection] = useState(null as string | null);

    const [selectedImageId, setSelectedImageId] = useState(null as number | null);

    const [imageChooserIsOpen, setImageChooserIsOpen] = useState(false);
    const [imageRearrangerIsOpen, setImageRearrangerIsOpen] = useState(false);

    const [deleteImageDialogIsOpen, setDeleteImageDialogIsOpen] = useState(false);

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

            <StyledHeader padding={2} >
                <Typography
                    align="center"
                    variant="h5"
                >
                    {exhibitionMetadata.title}
                </Typography>
            </StyledHeader>

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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
                            onChange={(e: SelectChangeEvent): void => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_floor_texture",
                                    newTexture: e.target.value
                                });
                            }}
                            value={exhibitionState.appearance.floor_texture}
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
                            onChange={(e: SelectChangeEvent): void => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_moodiness",
                                    newMoodiness: e.target.value
                                });
                            }}
                            value={exhibitionState.appearance.moodiness}
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_length",
                                    newValue: parseInt(e.target.value)
                                });
                            }}
                            type="number"
                            value={exhibitionState.size.length_ft}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption description="Width">
                        <Input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_width",
                                    newValue: parseInt(e.target.value)
                                });
                            }}
                            type="number"
                            value={exhibitionState.size.width_ft}
                        />
                    </ExhibitionOption>

                    <ExhibitionOption description="Height">
                        <Input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                exhibitionEditDispatch({
                                    scope: "exhibition",
                                    type: "set_height",
                                    newValue: parseInt(e.target.value)
                                });
                            }}
                            type="number"
                            value={exhibitionState.size.height_ft}
                        />
                    </ExhibitionOption>

                </ExhibitionOptionGroup>

                <ExhibitionOptionGroup
                    description="Image Settings"
                    expandedSection={expandedSection}
                    id="image_settings"
                    setExpandedSection={setExpandedSection}
                >

                    <ExhibitionOption>

                        <Button
                            fullWidth
                            onClick={(): void => {
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
                            onClick={(): void => {
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
                            disabled={!exhibitionState.images.length}
                            onChange={(e: SelectChangeEvent): void => {
                                setSelectedImageId(parseInt(e.target.value));
                            }}
                            sx={{ width: "100%", minHeight: "70px" }}
                            value={JSON.stringify(selectedImageId)}
                        >
                            {(exhibitionState.images).map((image) => {
                                const catalogImage = globalImageCatalog.find((i) => i.id === image.image_id);
                                return (
                                    <MenuItem
                                        key={image.image_id}
                                        value={image.image_id}
                                    >
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            spacing={1}
                                        >
                                            <Box
                                                height="40px"
                                                sx={{
                                                    backgroundImage: catalogImage != null ? `url("${catalogImage.thumbnailUrl as string}")` : undefined,
                                                    backgroundSize: "contain",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundPosition: "center"
                                                }}
                                                width="40px"
                                            />

                                            <Typography>
                                                {catalogImage !== undefined ? `${catalogImage.title}` : "No title"}
                                            </Typography>
                                        </Stack>
                                    </MenuItem>
                                );
                            })}
                        </Select>

                        <IconButton
                            disabled={selectedImageId == null}
                            onClick={(): void => {
                                setDeleteImageDialogIsOpen(true);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>

                    </ExhibitionOption>

                    { (selectedImageId != null)
                        ? (
                            <>
                                <AccordionSubHeading text="Position" />

                                <ExhibitionOption description="Wall">
                                    <Select
                                        onChange={(e: SelectChangeEvent<ExhibitionImageDirectionIdentifier>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_direction",
                                                newValue: e.target.value as ExhibitionImageDirectionIdentifier
                                            });
                                        }}
                                        value={getImageStateById(exhibitionState, selectedImageId).metadata.direction}
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
                                        checked={Boolean(getImageStateById(exhibitionState, selectedImageId).position.custom_position)}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_position_custom_enabled",
                                                isEnabled: e.target.checked
                                            });
                                        }}
                                    />

                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId).position.custom_position}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_position_custom_x",
                                                newValue: parseInt(e.target.value)
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId).position.custom_x}
                                    />

                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId).position.custom_position}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_position_custom_y",
                                                newValue: parseInt(e.target.value)
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId).position.custom_y}
                                    />

                                </ExhibitionOption>

                                <AccordionSubHeading text="Matte" />

                                <ExhibitionOption description="Color">
                                    <ColorInput
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_matte_color",
                                                newColor: e.target.value
                                            }
                                            );
                                        }}
                                        value={getImageStateById(exhibitionState, selectedImageId).matte.color}
                                    />

                                </ExhibitionOption>

                                <ExhibitionOption description="Custom Weight">

                                    <Checkbox
                                        checked={Boolean(getImageStateById(exhibitionState, selectedImageId).matte.weighted)}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_matte_weight_enabled",
                                                isEnabled: e.target.checked
                                            });
                                        }}
                                    />

                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId).matte.weighted}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_matte_weight_value",
                                                newValue: parseInt(e.target.value)
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId).matte.weighted_value}
                                    />
                                </ExhibitionOption>

                                <AccordionSubHeading text="Frame" />

                                <ExhibitionOption description="Custom Frame">
                                    <Checkbox
                                        checked={Boolean(getImageStateById(exhibitionState, selectedImageId).frame.custom)}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
                                        disabled={!getImageStateById(exhibitionState, selectedImageId).frame.custom}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_frame_color",
                                                newColor: e.target.value
                                            }
                                            );
                                        }}
                                        value={getImageStateById(exhibitionState, selectedImageId).frame.color}
                                    />

                                </ExhibitionOption>

                                <ExhibitionOption description="Width">
                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId).frame.custom}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_frame_width",
                                                newValue: parseInt(e.target.value)
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId).frame.width}
                                    />
                                </ExhibitionOption>

                                <ExhibitionOption description="Height">
                                    <Input
                                        disabled={!getImageStateById(exhibitionState, selectedImageId).frame.custom}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_frame_height",
                                                newValue: parseInt(e.target.value)
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId).frame.height}
                                    />
                                </ExhibitionOption>

                                <AccordionSubHeading text="Spotlight" />

                                <ExhibitionOption description="Color">
                                    <ColorInput
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_light_color",
                                                newColor: e.target.value
                                            }
                                            );
                                        }}
                                        value={getImageStateById(exhibitionState, selectedImageId).light.color}
                                    />
                                </ExhibitionOption>

                                <ExhibitionOption description="Intensity">
                                    <Input
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            exhibitionEditDispatch({
                                                scope: "image",
                                                image_id: selectedImageId,
                                                type: "set_light_intensity",
                                                newValue: parseInt(e.target.value)
                                            });
                                        }}
                                        type="number"
                                        value={getImageStateById(exhibitionState, selectedImageId).light.intensity}
                                    />
                                </ExhibitionOption>

                                <AccordionSubHeading text="Curator's Notes" />

                                <ExhibitionOption
                                    description="Description"
                                    vertical
                                >
                                    <TextField
                                        multiline
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
                                        value={getImageStateById(exhibitionState, selectedImageId).metadata.description}
                                        variant="outlined"
                                    />
                                </ExhibitionOption>

                                <ExhibitionOption
                                    description="Additional Information"
                                    vertical
                                >
                                    <TextField
                                        multiline
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
                                        value={getImageStateById(exhibitionState, selectedImageId).metadata.additional_information}
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
                    backgroundColor: "gray"
                }}
            >

                <Button
                    color={
                        appUser != null && appUser !== false && appUser.is_admin && appUser.id !== exhibitionMetadata.exhibition_owner ? "secondary" : "primary"
                    }
                    onClick={saveExhibition}
                    startIcon={
                        appUser != null && appUser !== false && appUser.is_admin && appUser.id !== exhibitionMetadata.exhibition_owner ? <SecurityIcon /> : <CloudUploadIcon />
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
                onSubmit={(e: React.FormEvent<HTMLDivElement>): void => {
                    e.preventDefault();
                    if (selectedImageId != null) {
                        exhibitionEditDispatch({
                            scope: "exhibition",
                            type: "remove_image",
                            image_id: selectedImageId
                        });
                    }
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
                            onClick={(): void => {
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
