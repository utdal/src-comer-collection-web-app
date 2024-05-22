import React from "react";
import { IconButton } from "@mui/material";
import { SettingsIcon } from "../../../Imports/Icons.js";
import PropTypes from "prop-types";

export const ExhibitionSettingsButton = ({ onClick, disabled = false }) => {
    return (
        <IconButton
            disabled={disabled}
            onClick={onClick}
        >
            <SettingsIcon />
        </IconButton>
    );
};

ExhibitionSettingsButton.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};
