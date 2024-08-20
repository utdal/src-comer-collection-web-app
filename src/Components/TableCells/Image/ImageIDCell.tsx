import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ImageItem } from "../../..";

const ImageIDCell = (): React.JSX.Element => {
    const image = useTableCellItem() as ImageItem;
    return (
        <Typography variant="body1">
            {image.id}
        </Typography>
    );
};

export default ImageIDCell;
