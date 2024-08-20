import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CollectionGalleryGrid from "../CollectionGallery/CollectionGalleryGrid";
import { AddPhotoAlternateIcon } from "../../Imports/Icons";
import { ManagementPageProvider, useItemsReducer } from "../../ContextProviders/ManagementPageProvider";
import { Image } from "../../Classes/Entities/Image";
import type { ExhibitionData, ExhibitionDispatchAction } from "./ExhibitionDispatchActionTypes";
import type { ImageItem, Intent } from "../../index.js";
import useDialogStates from "../../Hooks/useDialogStates";

const ImageChooserDialog = ({ imageChooserIsOpen, setImageChooserIsOpen, exhibitionState, globalImageCatalog, setSelectedImageId, exhibitionEditDispatch }: {
    readonly imageChooserIsOpen: boolean;
    readonly setImageChooserIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    readonly exhibitionState: ExhibitionData;
    readonly globalImageCatalog: ImageItem[];
    readonly setSelectedImageId: React.Dispatch<React.SetStateAction<number | null>>;
    readonly exhibitionEditDispatch: React.Dispatch<ExhibitionDispatchAction>;
}): React.JSX.Element => {
    const [imageChooserSelectedImage, setImageChooserSelectedImage] = useState(null as ImageItem | null);

    const [imageChooserItemsCombinedState, itemsCallbacks] = useItemsReducer(globalImageCatalog);
    const { setItems: setImageChooserItems } = itemsCallbacks;

    const dialogCallbacks = useDialogStates([] as Intent[]);

    useEffect(() => {
        setImageChooserItems(globalImageCatalog);
    }, [globalImageCatalog, setImageChooserItems]);

    return (
        <Dialog
            component="form"
            fullWidth
            maxWidth="xl"
            onSubmit={(e: React.FormEvent<HTMLDivElement>): void => {
                e.preventDefault();
                if (imageChooserSelectedImage) {
                    exhibitionEditDispatch({
                        scope: "exhibition",
                        type: "add_image",
                        image_id: imageChooserSelectedImage.id
                    });
                    setImageChooserIsOpen(false);
                    setImageChooserSelectedImage(null);
                    setSelectedImageId(imageChooserSelectedImage.id);
                }
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
                    itemsCallbacks={itemsCallbacks}
                    itemsCombinedState={imageChooserItemsCombinedState}
                    managementCallbacks={dialogCallbacks}
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
                        onClick={(): void => {
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

export default ImageChooserDialog;
