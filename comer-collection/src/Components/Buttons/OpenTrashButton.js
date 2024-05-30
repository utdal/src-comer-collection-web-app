import React, { useCallback } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { DeleteIcon } from "../../Imports/Icons.js";

/**
 * @param {{
 *  entity: Class
 * }} props
 */
const OpenTrashButton = () => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        navigate("Trash");
    }, [navigate]);

    return (
        <Button
            color="primary"
            onClick={handleClick}
            variant="outlined"
        >
            <DeleteIcon />
        </Button>
    );
};

export default OpenTrashButton;
