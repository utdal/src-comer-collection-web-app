import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { VisibilityIcon } from "../../../Imports/Icons.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

export const ImagePreviewThumbnailCell = () => {
    const image = useTableCellItem();
    const { handleOpenImagePreviewer } = useTableCellManagementCallbacks();
    const handleOpenPreviewer = useCallback(() => {
        handleOpenImagePreviewer(image);
    }, [handleOpenImagePreviewer, image]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            justifyContent="center"
            sx={{ height: "50px", maxWidth: "100px" }}
        >
            {(image.thumbnailUrl &&
                <Button onClick={handleOpenPreviewer} >
                    <img
                        height="50px"
                        loading="lazy"
                        src={`${process.env.REACT_APP_API_HOST}/api/public/images/${image.id}/download`}
                    />
                </Button>
            ) || (image.url &&
                <Button
                    color="primary"
                    onClick={handleOpenPreviewer}
                    startIcon={<VisibilityIcon />}
                    variant="outlined"
                >
                    <Typography variant="body1">
                        View
                    </Typography>
                </Button>
            )}
        </Stack>
    );
};
