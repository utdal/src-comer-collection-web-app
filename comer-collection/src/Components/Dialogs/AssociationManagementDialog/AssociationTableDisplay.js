import React from "react";
import { Stack, Typography, Box, styled } from "@mui/material";
import PropTypes from "prop-types";

const BoxWithGridLayout = styled(Box)(({ tableCaption }) => ({
    display: "grid",
    gridTemplateAreas: `
        "caption"
        "table"
    `,
    gridTemplateRows: tableCaption ? "50px 300px" : "0px 300px"
}));

const TableCaptionContainer = styled(Stack)(({ tableCaption }) => ({
    gridArea: "caption",
    display: tableCaption ? "" : "none",
    justifyContent: "center"
}));

export const AssociationTableDisplay = ({ tableCaption = "", children }) => {
    return (
        <BoxWithGridLayout tableCaption={tableCaption}>
            <TableCaptionContainer
                direction="row"
                tableCaption={tableCaption}
            >
                <Typography
                    align="center"
                    variant="h5"
                >
                    {tableCaption}
                </Typography>
            </TableCaptionContainer>

            <Box sx={{ gridArea: "table", height: "100%", overflowY: "auto" }}>
                {children}
            </Box>
        </BoxWithGridLayout>
    );
};

AssociationTableDisplay.propTypes = {
    children: PropTypes.node.isRequired,
    tableCaption: PropTypes.string.isRequired
};
