import React from "react";
import { Stack, Typography } from "@mui/material";
import { SellIcon } from "../../../Imports/Icons.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { TagItem } from "../../../index.js";

const TagDataCell = (): React.JSX.Element => {
    const tag = useTableCellItem() as TagItem;
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

export default TagDataCell;
