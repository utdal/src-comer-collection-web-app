import React from "react";
import ImagePermanentDeleteButton from "./ImagePermanentDeleteButton";
import ImageRestoreButton from "./ImageRestoreButton";
import { Stack } from "@mui/material";

const ImageDeletedOptionsCell = (): React.JSX.Element => {
    return (
        <Stack
            direction="row"
            spacing={2}
        >
            {/* <ImageEditButton />

            <ImageDeleteButton /> */}
            <ImageRestoreButton />

            <ImagePermanentDeleteButton />
        </Stack>
    );
};

export default ImageDeletedOptionsCell;
