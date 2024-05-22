import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Button, Stack, Typography } from "@mui/material";
import { useAppUser } from "../../../ContextProviders/AppUser.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { PhotoCameraBackIcon } from "../../../Imports/Icons.js";

export const ImageExhibitionCountCell = () => {
    const image = useTableRowItem();
    const [appUser] = useAppUser();
    const { handleOpenImageViewExhibitionDialog } = useManagementCallbacks();
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
