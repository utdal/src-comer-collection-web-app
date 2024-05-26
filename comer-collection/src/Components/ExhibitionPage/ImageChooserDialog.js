import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { CollectionGalleryDisplay } from "../CollectionGalleryDisplay.js";
import { AddPhotoAlternateIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { exhibitionStatePropTypesShape } from "../../Classes/Entities/Exhibition.js";
import { entityPropTypeShape } from "../../Classes/Entity.js";

export const ImageChooserDialog = ({ imageChooserIsOpen, setImageChooserIsOpen, exhibitionState, globalImageCatalog, setSelectedImageId, exhibitionEditDispatch }) => {
    const [imageChooserSelectedImage, setImageChooserSelectedImage] = useState(null);

    return (
        <Dialog
            component="form"
            fullWidth
            maxWidth="xl"
            onSubmit={(e) => {
                e.preventDefault();
                exhibitionEditDispatch({
                    scope: "exhibition",
                    type: "add_image",
                    image_id: imageChooserSelectedImage.id
                });
                setImageChooserIsOpen(false);
                setImageChooserSelectedImage(null);
                setSelectedImageId(imageChooserSelectedImage.id);
            }}
            open={imageChooserIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle>
                Choose an image
            </DialogTitle>

            <DialogContent>
                <CollectionGalleryDisplay
                    disabledImages={exhibitionState.images}
                    images={globalImageCatalog}
                    isDialogMode
                    selectedItem={imageChooserSelectedImage}
                    setSelectedItem={setImageChooserSelectedImage}
                />
            </DialogContent>

            <DialogActions>
                <Stack
                    direction="row"
                    justifyContent="right"
                    spacing={1}
                    width="100%"
                >
                    <Button
                        onClick={() => {
                            setImageChooserIsOpen(false);
                        }}
                        sx={{
                            width: "30%"
                        }}
                        variant="outlined"
                    >
                        <Typography variant="h6">
                            Cancel
                        </Typography>
                    </Button>

                    <Button
                        disabled={!imageChooserSelectedImage}
                        startIcon={<AddPhotoAlternateIcon />}
                        sx={{
                            width: "30%"
                        }}
                        type="submit"
                        variant="contained"
                    >
                        <Typography variant="h6">
                            Add to exhibition
                        </Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};
ImageChooserDialog.propTypes = {
    exhibitionEditDispatch: PropTypes.func.isRequired,
    exhibitionState: PropTypes.shape(exhibitionStatePropTypesShape).isRequired,
    globalImageCatalog: PropTypes.arrayOf(entityPropTypeShape),
    imageChooserIsOpen: PropTypes.bool.isRequired,
    setImageChooserIsOpen: PropTypes.func.isRequired,
    setSelectedImageId: PropTypes.func.isRequired
};
