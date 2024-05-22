import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Button, Typography } from "@mui/material";
import { ContentCopyIcon } from "../../../Imports/Icons.js";
import { useClipboard } from "../../../ContextProviders/AppFeatures.js";

export const ArtistWebsiteCell = () => {
    const artist = useTableRowItem();
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
