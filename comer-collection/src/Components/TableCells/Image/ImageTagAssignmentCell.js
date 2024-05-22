import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Button, Stack, Typography } from "@mui/material";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { BrushIcon } from "../../../Imports/Icons.js";

export const ImageTagAssignmentCell = () => {
    const image = useTableRowItem();
    const { handleOpenImageAssignTagDialog } = useManagementCallbacks();
    const handleOpenAssignTagDialog = useCallback(() => {
        handleOpenImageAssignTagDialog([image]);
    }, [handleOpenImageAssignTagDialog, image]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Button
                color="primary"
                onClick={handleOpenAssignTagDialog}
                startIcon={<BrushIcon />}
                variant="text"
            >
                <Typography variant="body1">
                    {image.Tags.length}
                </Typography>
            </Button>
        </Stack>
    );
};
