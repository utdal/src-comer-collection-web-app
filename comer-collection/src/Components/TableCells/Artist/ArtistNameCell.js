import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ArtistNameCell = () => {
    const artist = useTableRowItem();
    return (
        <Typography variant="body1">
            {artist.familyName}
            ,

            {" "}

            {artist.givenName}
        </Typography>
    );
};
