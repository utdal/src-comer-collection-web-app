import React from "react";
import { Stack, Typography } from "@mui/material";
import { ImageIcon } from "../../../Imports/Icons";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ImageItem, TagItem } from "../../../index.js";

const TagImageCountCell = (): React.JSX.Element => {
    const tag = useTableCellItem() as TagItem;
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <ImageIcon />

            <Typography variant="body1">
                {(tag.Images as ImageItem[]).length}
            </Typography>
        </Stack>
    );
};

export default TagImageCountCell;
