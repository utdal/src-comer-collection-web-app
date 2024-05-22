import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Stack, Typography } from "@mui/material";
import { LockIcon, PublicIcon, VpnLockIcon } from "../../../Imports/Icons.js";

export const ExhibitionAccessCell = () => {
    const exhibition = useTableRowItem();
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            {(exhibition.privacy === "PRIVATE" &&
                <LockIcon color="grey" />
            ) || (exhibition.privacy === "PUBLIC_ANONYMOUS" &&
                <VpnLockIcon color="grey" />
            ) || (exhibition.privacy === "PUBLIC" &&
                <PublicIcon color="grey" />
            )}

            <Typography variant="body1">
                {(exhibition.privacy === "PRIVATE" &&
                "Private"
                ) || (exhibition.privacy === "PUBLIC_ANONYMOUS" &&
                "Public Anonymous"
                ) || (exhibition.privacy === "PUBLIC" &&
                "Public"
                )}
            </Typography>
        </Stack>
    );
};
