import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const ExhibitionOpenInCurrentTabCell = () => {
    const exhibition = useTableCellItem();
    const navigate = useNavigate();
    const handleClick = useCallback(() => {
        navigate(`/Exhibitions/${exhibition.id}`);
    }, [exhibition.id, navigate]);
    return (
        <Button
            onClick={handleClick}
            target="_blank"
            variant="outlined"
        >
            <Typography variant="body1">
                Open
            </Typography>
        </Button>
    );
};
