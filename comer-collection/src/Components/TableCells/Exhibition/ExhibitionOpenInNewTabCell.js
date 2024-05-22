import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Button, Typography } from "@mui/material";
import { OpenInNewIcon } from "../../../Imports/Icons.js";

export const ExhibitionOpenInNewTabCell = () => {
    const exhibition = useTableRowItem();
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
