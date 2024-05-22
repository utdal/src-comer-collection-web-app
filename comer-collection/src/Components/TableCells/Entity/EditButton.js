import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { EditIcon } from "../../../Imports/Icons.js";

export const EditButton = ({ onClick, disabled }) => {
    return (
        <IconButton
            disabled={disabled}
            onClick={onClick}
        >
            <EditIcon />
        </IconButton>
    );
};

EditButton.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};

EditButton.defaultProps = {
    disabled: false
};
