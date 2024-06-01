import React from "react";
import { ArtistManageDeleteButton } from "./ArtistManageDeleteButton.js";
import { ArtistManageEditButton } from "./ArtistManageEditButton.js";
import { Stack } from "@mui/material";

export const ArtistManageOptionsCell = (): React.JSX.Element => {
    return (
        <Stack direction="row">
            <ArtistManageEditButton />

            <ArtistManageDeleteButton />
        </Stack>
    );
};
