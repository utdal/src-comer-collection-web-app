import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ArtistNotesCell = () => {
    const artist = useTableCellItem();
    return (artist.notes &&
        <Typography variant="body1">
            {artist.notes}
        </Typography>
    ) || (!artist.notes &&
        <Typography
            sx={{ opacity: 0.5 }}
            variant="body1"
        />
    );
};
