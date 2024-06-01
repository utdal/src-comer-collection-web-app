import React from "react";
import type { BoxProps, Theme, StackOwnProps } from "@mui/material";
import { Stack, Typography, Box, styled, useTheme } from "@mui/material";

interface BoxWithGridLayoutProps extends BoxProps {
    tableCaption: string;
    theme: Theme;
}

interface TableCaptionContainerProps extends StackOwnProps {
    tableCaption: string;
}

const BoxWithGridLayout = styled(Box)(({ tableCaption }: BoxWithGridLayoutProps) => ({
    display: "grid",
    gridTemplateAreas: `
        "caption"
        "table"
    `,
    gridTemplateRows: tableCaption ? "50px 300px" : "0px 300px"
}));

const TableCaptionContainer = styled(Stack)(({ tableCaption }: TableCaptionContainerProps) => ({
    gridArea: "caption",
    display: tableCaption ? "" : "none",
    justifyContent: "center"
}));

const AssociationTableDisplay = ({ tableCaption = "", children }: {
    readonly tableCaption: string;
    readonly children: React.ReactNode;
}): React.JSX.Element => {
    const theme = useTheme();

    return (
        <BoxWithGridLayout
            tableCaption={tableCaption}
            theme={theme}
        >
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

export default AssociationTableDisplay;
