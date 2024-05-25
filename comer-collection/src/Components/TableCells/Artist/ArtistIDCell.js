import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ArtistIDCell = () => {
    const artist = useTableCellItem();
    return (
        <Typography variant="body1">
            {artist.id}
        </Typography>
    );
};
