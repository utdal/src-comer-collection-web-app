import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { BrushIcon } from "../../../Imports/Icons.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

export const ImageTagAssignmentCell = () => {
    const image = useTableCellItem();
    const { handleOpenImageAssignTagDialog } = useTableCellManagementCallbacks();
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
