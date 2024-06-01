import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { PhotoCameraBackIcon } from "../../../Imports/Icons";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { AppUser, ExhibitionItem, ImageItem } from "../../../index.js";
import useAppUser from "../../../Hooks/useAppUser";

const ImageExhibitionCountCell = (): React.JSX.Element => {
    const image = useTableCellItem() as ImageItem;
    const appUser = useAppUser() as AppUser;
    // const { handleOpenImageViewExhibitionDialog } = useTableCellManagementCallbacks();
    // const handleOpenViewExhibitionDialog = useCallback(() => {
    //     handleOpenImageViewExhibitionDialog([image]);
    // }, [handleOpenImageViewExhibitionDialog, image]);
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            <Button
                color="primary"
                disabled={!appUser.is_admin}
                // onClick={handleOpenViewExhibitionDialog}
                startIcon={<PhotoCameraBackIcon />}
                sx={{ textTransform: "unset" }}
                variant="text"
            >
                <Typography variant="body1">
                    {(image.Exhibitions as ExhibitionItem[]).length}
                </Typography>
            </Button>
        </Stack>
    );
};

export default ImageExhibitionCountCell;
