import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ImageItem } from "../../..";

const ImageTitleCell = (): React.JSX.Element => {
    const image = useTableCellItem() as ImageItem;
    return (
        <Typography variant="body1">
            {image.title}
        </Typography>
    );
};

export default ImageTitleCell;
