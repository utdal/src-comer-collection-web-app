import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { TagItem } from "../../..";

const TagIDCell = (): React.JSX.Element => {
    const tag = useTableCellItem() as TagItem;
    return (
        <Typography variant="body1">
            {tag.id}
        </Typography>
    );
};

export default TagIDCell;
