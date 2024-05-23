import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export const ExhibitionOpenInCurrentTabCell = () => {
    const exhibition = useTableRowItem();
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
