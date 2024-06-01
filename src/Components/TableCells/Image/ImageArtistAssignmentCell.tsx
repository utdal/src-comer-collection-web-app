import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { BrushIcon } from "../../../Imports/Icons.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ArtistItem, ImageItem } from "../../../index.js";

const ImageArtistAssignmentCell = (): React.JSX.Element => {
    const image = useTableCellItem() as ImageItem;
    // const { handleOpenImageAssignArtistDialog } = useTableCellManagementCallbacks();
    // const handleOpenAssignArtistDialog = useCallback(() => {
    //     handleOpenImageAssignArtistDialog([image]);
    // }, [handleOpenImageAssignArtistDialog, image]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Button
                color="primary"
                // onClick={handleOpenAssignArtistDialog}
                startIcon={<BrushIcon />}
                variant="text"
            >
                <Typography variant="body1">
                    {(image.Artists as ArtistItem[]).length}
                </Typography>
            </Button>
        </Stack>
    );
};

export default ImageArtistAssignmentCell;
