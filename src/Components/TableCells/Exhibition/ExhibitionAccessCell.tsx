import React from "react";
import { Stack, Typography } from "@mui/material";
import { LockIcon, PublicIcon, VpnLockIcon } from "../../../Imports/Icons";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem } from "../../../index.js";

const ExhibitionAccessCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            {
                exhibition.privacy === "PRIVATE"
                    ? (
                        <LockIcon htmlColor="gray" />
                    )
                    : exhibition.privacy === "PUBLIC_ANONYMOUS"
                        ? (
                            <VpnLockIcon htmlColor="gray" />
                        )
                        : (
                            <PublicIcon htmlColor="gray" />
                        )
            }

            <Typography variant="body1">
                {exhibition.privacy === "PRIVATE"
                    ? "Private"
                    : exhibition.privacy === "PUBLIC_ANONYMOUS"
                        ? "Public Anonymous"
                        : "Public"}

            </Typography>
        </Stack>
    );
};

export default ExhibitionAccessCell;
