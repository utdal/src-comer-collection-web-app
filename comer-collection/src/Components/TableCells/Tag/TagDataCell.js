import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Stack, Typography } from "@mui/material";
import { SellIcon } from "../../../Imports/Icons.js";

export const TagDataCell = () => {
    const tag = useTableRowItem();
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
