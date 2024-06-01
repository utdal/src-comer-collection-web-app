import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ArtistItem } from "../../../index.js";

const ArtistNameCell = (): React.JSX.Element => {
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

export default ArtistNameCell;
