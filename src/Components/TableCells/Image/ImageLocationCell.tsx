import React from "react";
import { Stack, Typography } from "@mui/material";
import { PlaceIcon } from "../../../Imports/Icons.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ImageItem } from "../../../index.js";

const ImageLocationCell = (): React.JSX.Element => {
    const image = useTableCellItem() as ImageItem;
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            <PlaceIcon />

            <Typography variant="body1">
                {image.location}
            </Typography>
        </Stack>
    );
};

export default ImageLocationCell;
