import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { BrushIcon } from "../../../Imports/Icons.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

export const ImageArtistAssignmentCell = () => {
    const image = useTableCellItem();
    const { handleOpenImageAssignArtistDialog } = useTableCellManagementCallbacks();
    const handleOpenAssignArtistDialog = useCallback(() => {
        handleOpenImageAssignArtistDialog([image]);
    }, [handleOpenImageAssignArtistDialog, image]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Button
                color="primary"
                onClick={handleOpenAssignArtistDialog}
                startIcon={<BrushIcon />}
                variant="text"
            >
                <Typography variant="body1">
                    {image.Artists.length}
                </Typography>
            </Button>
        </Stack>
    );
};
