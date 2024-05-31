import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { ContentCopyIcon } from "../../../Imports/Icons.js";
import { useClipboard } from "../../../ContextProviders/AppFeatures.tsx";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ArtistWebsiteCell = () => {
    const artist = useTableCellItem();
    const clipboard = useClipboard();
    const handleCopy = useCallback(() => {
        clipboard(artist.website);
    }, [artist, clipboard]);
    return artist.website && (
        <Button
            endIcon={<ContentCopyIcon />}
            onClick={handleCopy}
            size="small"
            sx={{ textTransform: "unset" }}
        >
            <Typography variant="body1">
                {artist.website}
            </Typography>
        </Button>
    );
};
