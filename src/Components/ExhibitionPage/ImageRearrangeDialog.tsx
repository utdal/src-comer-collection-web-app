import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useState } from "react";
import {
    BrokenImageIcon,
    ArrowBackIcon,
    ArrowForwardIcon
} from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { getSwappedImageArray, directionOptions } from "./ExhibitionEditPane";
import { exhibitionStatePropTypesShape } from "../../Classes/Entities/Exhibition";
import { entityPropTypeShape } from "../../Classes/Entity";
import type { ExhibitionData, ExhibitionDispatchAction } from "./ExhibitionDispatchActionTypes.js";
import type { Item } from "../../index.js";

interface ImageRearrangeDialogProps {
    imageRearrangerIsOpen: boolean;
    setImageRearrangerIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    exhibitionState: ExhibitionData;
    exhibitionEditDispatch: React.Dispatch<ExhibitionDispatchAction>;
    globalImageCatalog: Item[];
}

export const ImageRearrangeDialog = ({ imageRearrangerIsOpen, setImageRearrangerIsOpen, exhibitionState, exhibitionEditDispatch, globalImageCatalog }: ImageRearrangeDialogProps): React.JSX.Element => {
    const [currentWall, setCurrentWall] = useState(1);

    const imagesOnWall = exhibitionState.images.filter((i) => i.metadata.direction === currentWall);

    const handleImageSwap = (aId: number, bId: number): void => {
        const newArray = getSwappedImageArray(exhibitionState.images, aId, bId);
        exhibitionEditDispatch({
            scope: "exhibition",
            type: "set_images",
            newImages: newArray
        });
    };

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={imageRearrangerIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle>
                Rearrange images
            </DialogTitle>

            <DialogContent>

                <ToggleButtonGroup
                    exclusive
                    onChange={(e: React.MouseEvent, value: number): void => {
                        setCurrentWall(value);
                    }}
                    sx={{
                        width: "100%"
                    }}
                    value={currentWall}
                >
                    {directionOptions.map((option) => (
                        <ToggleButton
                            key={option.value}
                            selected={option.value === currentWall}
                            sx={{
                                textTransform: "unset",
                                width: "100%"
                            }}
                            value={option.value}
                        >
                            <Typography>
                                {option.displayText}
                            </Typography>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </DialogContent>

            <DialogContent>
                <Stack
                    direction="row"
                    spacing={2}
                    width="100%"
                >
                    {imagesOnWall.length > 0
                        ? (
                            imagesOnWall.map((i, index) => {
                                const catalogImage = globalImageCatalog.find((gi) => gi.id === i.image_id);
                                return (
                                    <Stack
                                        alignItems="center"
                                        direction="column"
                                        justifyItems="center"
                                        key={i.image_id}
                                        spacing={2}
                                    >
                                        <Box
                                            height="150px"
                                            sx={{
                                                backgroundImage: catalogImage != null ? `url("${catalogImage.thumbnailUrl as string}")` : undefined,
                                                backgroundPosition: "center",
                                                backgroundSize: "contain",
                                                backgroundRepeat: "no-repeat"
                                            }}
                                            width="150px"
                                        >
                                            {Boolean(catalogImage?.thumbnailUrl) && (
                                                <BrokenImageIcon sx={{
                                                    opacity: 0.2,
                                                    width: "100%",
                                                    height: "100%"
                                                }}
                                                />
                                            )}
                                        </Box>

                                        <Typography>
                                            {`${catalogImage?.title as string}`}
                                        </Typography>

                                        <Stack direction="row">
                                            <IconButton
                                                disabled={index === 0}
                                                onClick={(): void => {
                                                    handleImageSwap(imagesOnWall[index - 1].image_id, i.image_id);
                                                }}
                                            >
                                                <ArrowBackIcon />
                                            </IconButton>

                                            <IconButton
                                                disabled={index === imagesOnWall.length - 1}
                                                onClick={(): void => {
                                                    handleImageSwap(imagesOnWall[index + 1].image_id, i.image_id);
                                                }}
                                            >
                                                <ArrowForwardIcon />
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                );
                            })
                        )
                        : (
                            <Stack spacing={1}>
                                <Typography>
                                    The selected wall contains no images.
                                </Typography>

                            </Stack>
                        )}
                </Stack>
            </DialogContent>

            <DialogContent>
                <Typography sx={{
                    opacity: 0.5
                }}
                >
                    To move images between walls, close this dialog, select the image you want to move, and use the dropdown menu to select the destination wall.
                </Typography>
            </DialogContent>

            <DialogActions>
                <Stack
                    direction="row"
                    justifyContent="right"
                    spacing={1}
                    width="100%"
                >
                    <Button
                        onClick={(): void => {
                            setImageRearrangerIsOpen(false);
                        }}
                        sx={{
                            width: "30%"
                        }}
                        variant="contained"
                    >
                        <Typography variant="h6">
                            Close
                        </Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

ImageRearrangeDialog.propTypes = {
    exhibitionEditDispatch: PropTypes.func.isRequired,
    exhibitionState: exhibitionStatePropTypesShape,
    globalImageCatalog: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    imageRearrangerIsOpen: PropTypes.bool.isRequired,
    setImageRearrangerIsOpen: PropTypes.func.isRequired
};
