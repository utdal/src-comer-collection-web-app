import React from "react";
import { Button, Typography } from "@mui/material";
import { OpenInNewIcon } from "../../../Imports/Icons";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem } from "../../../index.js";

const ExhibitionOpenInNewTabCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    return (
        <Button
            endIcon={<OpenInNewIcon />}
            href={`/Exhibitions/${exhibition.id}`}
            target="_blank"
            variant="outlined"
        >
            <Typography variant="body1">
                Open
            </Typography>
        </Button>
    );
};

export default ExhibitionOpenInNewTabCell;
