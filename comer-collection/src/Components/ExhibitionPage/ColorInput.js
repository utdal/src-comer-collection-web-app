import React from "react";
import PropTypes from "prop-types";

export const ColorInput = ({ value, onChange, disabled }) => {
    return (
        <input
            disabled={disabled}
            onChange={onChange}
            type="color"
            value={value ?? ""}
        />
    );
};
ColorInput.propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};
