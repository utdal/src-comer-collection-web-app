import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import type { ArtistItem } from "../../../index.js";

export const ArtistNameCell = (): React.JSX.Element => {
    const artist = useTableCellItem() as ArtistItem;
    return (
        <Typography>
            {artist.familyName}
            ,

            {" "}

            {artist.givenName}
        </Typography>
    );
};
