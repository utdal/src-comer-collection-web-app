import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CollectionGalleryGrid } from "../CollectionGallery/CollectionGalleryGrid.js";
import { AddPhotoAlternateIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { exhibitionStatePropTypesShape } from "../../Classes/Entities/Exhibition";
import { entityPropTypeShape } from "../../Classes/Entity";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { Image } from "../../Classes/Entities/Image";

export const ImageChooserDialog = ({ imageChooserIsOpen, setImageChooserIsOpen, exhibitionState, globalImageCatalog, setSelectedImageId, exhibitionEditDispatch }) => {
    const [imageChooserSelectedImage, setImageChooserSelectedImage] = useState(null);

    const [imageChooserItemsCombinedState, { setItems: setImageChooserItems }] = useItemsReducer();

    useEffect(() => {
        if (globalImageCatalog) {
            setImageChooserItems();
        }
    }, [globalImageCatalog, setImageChooserItems]);

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
                <ManagementPageProvider
                    Entity={Image}
                    itemsCombinedState={imageChooserItemsCombinedState}
                >

                    <CollectionGalleryGrid
                        disabledImages={exhibitionState.images}
                        isDialogMode
                        selectedItem={imageChooserSelectedImage}
                        setSelectedItem={setImageChooserSelectedImage}
                    />
                </ManagementPageProvider>
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
    exhibitionState: exhibitionStatePropTypesShape.isRequired,
    globalImageCatalog: PropTypes.arrayOf(entityPropTypeShape),
    imageChooserIsOpen: PropTypes.bool.isRequired,
    setImageChooserIsOpen: PropTypes.func.isRequired,
    setSelectedImageId: PropTypes.func.isRequired
};
