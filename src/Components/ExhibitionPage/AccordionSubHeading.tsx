import { Divider, Typography } from "@mui/material";
import React from "react";

const AccordionSubHeading = ({ text }: {
    readonly text: string;
}): React.JSX.Element => {
    return (
        <>
            <Divider />

            <Typography
                align="center"
                variant="h6"
            >
                {text}
            </Typography>
        </>
    );
};

export default AccordionSubHeading;
