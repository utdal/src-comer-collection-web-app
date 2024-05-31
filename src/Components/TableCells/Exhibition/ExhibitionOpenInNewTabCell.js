import React from "react";
import { Button, Typography } from "@mui/material";
import { OpenInNewIcon } from "../../../Imports/Icons.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ExhibitionOpenInNewTabCell = () => {
    const exhibition = useTableCellItem();
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
