import React from "react";
import { Stack, Typography } from "@mui/material";
import { SellIcon } from "../../../Imports/Icons.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const TagDataCell = () => {
    const tag = useTableCellItem();
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <SellIcon />

            <Typography variant="body1">
                {tag.data}
            </Typography>
        </Stack>
    );
};
