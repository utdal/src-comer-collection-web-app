import React from "react";
import { Stack, Typography } from "@mui/material";
import { ImageIcon } from "../../../Imports/Icons.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ArtistItem, ImageItem } from "../../../index.js";

const ArtistImageCountCell = (): React.JSX.Element => {
    const artist = useTableCellItem() as ArtistItem;
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <ImageIcon />

            <Typography>
                {(artist.Images as ImageItem[]).length}
            </Typography>
        </Stack>
    );
};

export default ArtistImageCountCell;
