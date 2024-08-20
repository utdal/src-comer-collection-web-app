import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { ContentCopyIcon } from "../../../Imports/Icons";
import { useClipboard } from "../../../ContextProviders/AppFeatures";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ArtistItem } from "../../../index.js";

const ArtistWebsiteCell = (): React.JSX.Element => {
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
        : (
            <Typography>
                No website
            </Typography>
        );
};

export default ArtistWebsiteCell;
