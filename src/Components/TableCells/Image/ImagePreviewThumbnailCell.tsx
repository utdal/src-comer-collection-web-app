import React from "react";
import { Stack } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ImageItem } from "../../../index.js";

const ImagePreviewThumbnailCell = (): React.JSX.Element => {
    const image = useTableCellItem() as ImageItem;
    // const { handleOpenImagePreviewer } = useTableCellManagementCallbacks();
    // const handleOpenPreviewer = useCallback(() => {
    //     handleOpenImagePreviewer(image);
    // }, [handleOpenImagePreviewer, image]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            justifyContent="center"
            sx={{ height: "50px", maxWidth: "100px" }}
        >
            {image.id}

            {/* {(image.thumbnailUrl &&
                <Button onClick={handleOpenPreviewer} >
                    <img
                        height="50px"
                        loading="lazy"
                        src={`${process.env.REACT_APP_API_HOST}/api/images/${image.id}/download`}
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
            )} */}
        </Stack>
    );
};

export default ImagePreviewThumbnailCell;
