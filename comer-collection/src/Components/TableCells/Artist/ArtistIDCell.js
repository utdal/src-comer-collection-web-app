import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ArtistIDCell = () => {
    const artist = useTableRowItem();
    return (
        <Typography variant="body1">
            {artist.id}
        </Typography>
    );
};
