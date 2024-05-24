import React from "react";
import { Stack, Typography } from "@mui/material";
import { PlaceIcon } from "../../../Imports/Icons.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ImageLocationCell = () => {
    const image = useTableCellItem();
    return (
        image.location && (
            <Stack
                direction="row"
                spacing={1}
            >
                <PlaceIcon />

                <Typography variant="body1">
                    {image.location}
                </Typography>
            </Stack>
        )
    );
};
