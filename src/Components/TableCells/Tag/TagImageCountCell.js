import React from "react";
import { Stack, Typography } from "@mui/material";
import { ImageIcon } from "../../../Imports/Icons.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const TagImageCountCell = () => {
    const tag = useTableCellItem();
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
