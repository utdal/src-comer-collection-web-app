import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { DeleteIcon } from "../../../Imports/Icons.js";

export const DeleteButton = ({ onClick, disabled }) => {
    return (
        <IconButton
            disabled={disabled}
            onClick={onClick}
        >
            <DeleteIcon />
        </IconButton>
    );
};

DeleteButton.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};

DeleteButton.defaultProps = {
    disabled: false
};
