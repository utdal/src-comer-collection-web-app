import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Stack, Typography } from "@mui/material";
import { ImageIcon } from "../../../Imports/Icons.js";

export const TagImageCountCell = () => {
    const tag = useTableRowItem();
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <ImageIcon />

            <Typography variant="body1">
                {tag.Images.length}
            </Typography>
        </Stack>
    );
};
