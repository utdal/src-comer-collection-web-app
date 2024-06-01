import React, { useCallback } from "react";
import { Button } from "@mui/material";
import { ContentCopyIcon } from "../../../Imports/Icons.js";
import { useClipboard } from "../../../ContextProviders/AppFeatures.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import type { ArtistItem } from "../../../index.js";

export const ArtistWebsiteCell = (): React.JSX.Element | null => {
    const artist = useTableCellItem() as ArtistItem;
    const clipboard = useClipboard();

    const handleCopy = useCallback(() => {
        if (artist.website != null) {
            clipboard(artist.website);
        }
    }, [artist, clipboard]);

    return artist.website != null
        ? (
            <Button
                endIcon={<ContentCopyIcon />}
                onClick={handleCopy}
                size="small"
                sx={{ textTransform: "unset" }}
            >
                {artist.website}
            </Button>
        )
        : null;
};
