import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useAppUser } from "../../../Hooks/useAppUser.ts";
import { PhotoCameraBackIcon } from "../../../Imports/Icons.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

export const ImageExhibitionCountCell = () => {
    const image = useTableCellItem();
    const appUser = useAppUser();
    const { handleOpenImageViewExhibitionDialog } = useTableCellManagementCallbacks();
    const handleOpenViewExhibitionDialog = useCallback(() => {
        handleOpenImageViewExhibitionDialog([image]);
    }, [handleOpenImageViewExhibitionDialog, image]);
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            <Button
                color="primary"
                disabled={!appUser.is_admin}
                onClick={handleOpenViewExhibitionDialog}
                startIcon={<PhotoCameraBackIcon />}
                sx={{ textTransform: "unset" }}
                variant="text"
            >
                <Typography variant="body1">
                    {image.Exhibitions.length}
                </Typography>
            </Button>
        </Stack>
    );
};
