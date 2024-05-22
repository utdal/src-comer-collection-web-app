import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Typography } from "@mui/material";

export const ArtistNotesCell = () => {
    const artist = useTableRowItem();
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
