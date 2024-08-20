import React from "react";

const FullLogo = ({ maxWidth = 200 }: {
    readonly maxWidth?: number;
}): React.JSX.Element => {
    return (
        <img
            src="/images/logo_square_orange.png"
            style={{ maxWidth }}
        />
    );
};

export default FullLogo;
