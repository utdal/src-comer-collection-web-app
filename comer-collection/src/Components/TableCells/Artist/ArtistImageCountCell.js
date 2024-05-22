import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Stack, Typography } from "@mui/material";
import { ImageIcon } from "../../../Imports/Icons.js";

export const ArtistImageCountCell = () => {
    const artist = useTableRowItem();
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <ImageIcon />

            <Typography variant="body1">
                {artist.Images.length}
            </Typography>
        </Stack>
    );
};
