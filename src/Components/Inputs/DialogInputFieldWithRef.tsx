import { TextField } from "@mui/material";
import React from "react";
import type { EntityFieldDefinition, ItemGenericFieldValue } from "../..";

const DialogInputFieldWithRef = ({ fieldDefinition, defaultValue, inputRef }: {
    readonly defaultValue?: ItemGenericFieldValue;
    readonly fieldDefinition: EntityFieldDefinition;
    readonly inputRef: React.Ref<HTMLInputElement> | React.RefCallback<HTMLInputElement>;
}): React.JSX.Element => {
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

export default DialogInputFieldWithRef;
