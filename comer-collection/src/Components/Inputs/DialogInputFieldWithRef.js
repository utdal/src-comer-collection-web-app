import { TextField } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

export const DialogInputFieldWithRef = ({ fieldDefinition, defaultValue, inputRef }) => {
    return (
        <TextField
            defaultValue={defaultValue}
            inputProps={{
                type: fieldDefinition.inputType,
                min: fieldDefinition.minValue ?? ""
            }}
            inputRef={inputRef}
            label={fieldDefinition.displayName}
            minRows={2}
            multiline={fieldDefinition.multiline}
            name={fieldDefinition.fieldName}
            required={fieldDefinition.isRequired}
        />
    );
};

DialogInputFieldWithRef.propTypes = {
    defaultValue: PropTypes.node.isRequired,
    fieldDefinition: PropTypes.shape({
        inputType: PropTypes.string,
        fieldName: PropTypes.string,
        minValue: PropTypes.number,
        displayName: PropTypes.string,
        multiline: PropTypes.bool,
        isRequired: PropTypes.bool
    }).isRequired,
    inputRef: PropTypes.node.isRequired
};
