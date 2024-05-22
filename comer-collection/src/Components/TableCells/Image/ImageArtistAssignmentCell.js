import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Button, Stack, Typography } from "@mui/material";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { BrushIcon } from "../../../Imports/Icons.js";

export const ImageArtistAssignmentCell = () => {
    const image = useTableRowItem();
    const { handleOpenImageAssignArtistDialog } = useManagementCallbacks();
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
