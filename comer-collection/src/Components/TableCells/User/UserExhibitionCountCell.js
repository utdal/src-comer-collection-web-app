import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { PhotoCameraBackIcon } from "../../../Imports/Icons.js";

export const UserExhibitionCountCell = () => {
    const user = useTableRowItem();
    const { handleOpenViewUserExhibitionDialog } = useManagementCallbacks();
    const handleOpenViewExhibitionDialog = useCallback(() => {
        handleOpenViewUserExhibitionDialog(user);
    }, [handleOpenViewUserExhibitionDialog, user]);
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            <Button
                color="lightgrey"
                onClick={handleOpenViewExhibitionDialog}
                startIcon={<PhotoCameraBackIcon />}
                sx={{ textTransform: "unset" }}
                variant="text"
            >
                <Typography variant="body1">
                    {user.Exhibitions.length}

                    {" "}
                    of

                    {" "}

                    {user.exhibition_quota}
                </Typography>
            </Button>
        </Stack>
    );
};
