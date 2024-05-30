import React from "react";
import { ImagePermanentDeleteButton } from "./ImagePermanentDeleteButton.js";
import ImageRestoreButton from "./ImageRestoreButton.js";
import { Stack } from "@mui/material";

export const ImageDeletedOptionsCell = () => {
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
