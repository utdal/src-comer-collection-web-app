import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { ExhibitionItem } from "../../../index.js";

const ExhibitionOpenInCurrentTabCell = (): React.JSX.Element => {
    const exhibition = useTableCellItem() as ExhibitionItem;
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        navigate(`/Exhibitions/${exhibition.id}`);
    }, [exhibition.id, navigate]);

    return (
        <Button
            onClick={handleClick}
            variant="outlined"
        >
            <Typography variant="body1">
                Open
            </Typography>
        </Button>
    );
};

export default ExhibitionOpenInCurrentTabCell;
