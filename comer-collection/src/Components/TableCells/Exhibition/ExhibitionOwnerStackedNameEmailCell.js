import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ExhibitionOwnerStackedNameEmailCell = () => {
    const { User: owner } = useTableCellItem();
    return (
        <Stack
            direction="column"
            paddingBottom={1}
            paddingTop={1}
        >
            <Typography variant="body1">
                {owner.full_name_reverse}
            </Typography>

            <Typography
                sx={{ opacity: 0.5 }}
                variant="body1"
            >
                {owner.email}
            </Typography>
        </Stack>
    );
};
