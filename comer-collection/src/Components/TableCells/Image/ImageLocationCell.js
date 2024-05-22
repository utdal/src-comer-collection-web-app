import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Stack, Typography } from "@mui/material";
import { PlaceIcon } from "../../../Imports/Icons.js";

export const ImageLocationCell = () => {
    const image = useTableRowItem();
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
