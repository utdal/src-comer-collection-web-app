import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { SellIcon } from "../../../Imports/Icons";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ImageItem, TagItem } from "../../../index.js";

const ImageTagAssignmentCell = (): React.JSX.Element => {
    const image = useTableCellItem() as ImageItem;
    // const { handleOpenImageAssignTagDialog } = useTableCellManagementCallbacks();
    // const handleOpenAssignTagDialog = useCallback(() => {
    //     handleOpenImageAssignTagDialog([image]);
    // }, [handleOpenImageAssignTagDialog, image]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Button
                color="primary"
                // onClick={handleOpenAssignTagDialog}
                startIcon={<SellIcon />}
                variant="text"
            >
                <Typography variant="body1">
                    {(image.Tags as TagItem[]).length}
                </Typography>
            </Button>
        </Stack>
    );
};

export default ImageTagAssignmentCell;
