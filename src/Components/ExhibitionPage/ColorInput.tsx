import React from "react";

const ColorInput = ({ value, onChange, disabled = false }: {
    readonly value: string;
    readonly onChange: React.ChangeEventHandler<HTMLInputElement>;
    readonly disabled?: boolean;
}): React.JSX.Element => {
    return (
        <input
            disabled={disabled}
            onChange={onChange}
            type="color"
            value={value}
        />
    );
};

export default ColorInput;
