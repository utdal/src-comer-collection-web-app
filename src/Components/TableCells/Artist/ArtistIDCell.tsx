import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ArtistItem } from "../../../index.js";

const ArtistIDCell = (): React.JSX.Element => {
    const artist = useTableCellItem() as ArtistItem;
    return (
        <Typography>
            {artist.id}
        </Typography>
    );
};

export default ArtistIDCell;
