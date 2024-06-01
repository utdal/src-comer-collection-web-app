import { TextField } from "@mui/material";
import React from "react";
import type { EntityFieldDefinition } from "../..";

const DialogInputFieldWithRef = ({ fieldDefinition, inputRef }: {
    readonly fieldDefinition: EntityFieldDefinition;
    readonly inputRef: React.Ref<Element> | React.RefCallback<Element>;
}): React.JSX.Element => {
    return (
        <TextField
            defaultValue={fieldDefinition.blank as string}
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
