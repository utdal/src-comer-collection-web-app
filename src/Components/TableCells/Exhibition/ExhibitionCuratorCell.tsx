import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem } from "../../../index.js";

const ExhibitionCuratorCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    return (
        <Typography variant="body1">
            {exhibition.curator}
        </Typography>
    );
};

export default ExhibitionCuratorCell;
