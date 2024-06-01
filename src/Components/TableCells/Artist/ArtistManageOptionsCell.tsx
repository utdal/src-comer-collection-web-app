import React from "react";
import ArtistManageDeleteButton from "./ArtistManageDeleteButton";
import ArtistManageEditButton from "./ArtistManageEditButton";
import { Stack } from "@mui/material";

const ArtistManageOptionsCell = (): React.JSX.Element => {
    return (
        <Stack direction="row">
            <ArtistManageEditButton />

            <ArtistManageDeleteButton />
        </Stack>
    );
};

export default ArtistManageOptionsCell;
