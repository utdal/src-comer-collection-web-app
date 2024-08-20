import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ArtistItem } from "../../../index.js";

const ArtistNotesCell = (): React.JSX.Element => {
    const artist = useTableCellItem() as ArtistItem;

    return artist.notes != null
        ? (
            <Typography>
                {`${artist.notes}`}
            </Typography>
        )
        : (
            <Typography
                sx={{ opacity: 0.5 }}
                variant="body1"
            />
        );
};

export default ArtistNotesCell;
