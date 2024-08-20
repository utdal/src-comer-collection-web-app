import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem } from "../../../index.js";

const ExhibitionTitleCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    return (
        exhibition.title != null
            ? (
                <Typography variant="body1">
                    {exhibition.title}
                </Typography>
            )
            : (
                <Typography
                    sx={{ opacity: 0.5 }}
                    variant="body1"
                >
                    Not set
                </Typography>
            )
    );
};

export default ExhibitionTitleCell;
