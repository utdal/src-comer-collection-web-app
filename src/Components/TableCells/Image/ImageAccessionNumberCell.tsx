import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ImageItem } from "../../..";

const ImageAccessionNumberCell = (): React.JSX.Element => {
    const image = useTableCellItem() as ImageItem;
    return (
        <Typography variant="body1">
            {image.accessionNumber}
        </Typography>
    );
};

export default ImageAccessionNumberCell;
