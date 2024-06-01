import { Accordion, AccordionDetails, AccordionSummary, Box, ListItemButton, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { ExpandMoreIcon } from "../../Imports/Icons.js";

const ExhibitionOptionGroup = ({ id, description, expandedSection, setExpandedSection, children }: {
    readonly children: React.ReactNode;
    readonly description: string;
    readonly expandedSection: string | null;
    readonly id: string;
    readonly setExpandedSection: React.Dispatch<React.SetStateAction<string | null>>;
}): React.JSX.Element => {
    return (
        <Accordion
            disableGutters
            expanded={expandedSection === id}
        >
            <Box
                component={Paper}
                square
                sx={{
                    width: "100%",
                    position: "sticky",
                    top: "0px",
                    zIndex: 100
                }}
            >
                <ListItemButton
                    onClick={(): void => {
                        // setExpandedSection((newSection: string) => (
                        //     newSection === id ? null : id
                        // ));
                        setExpandedSection(null);
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ width: "100%" }}
                    >
                        <Typography variant="h6">
                            {description}
                        </Typography>
                    </AccordionSummary>
                </ListItemButton>
            </Box>

            <AccordionDetails>
                <Stack
                    direction="column"
                    spacing={1}
                >
                    {children}
                </Stack>
            </AccordionDetails>

        </Accordion>

    );
};

export default ExhibitionOptionGroup;
