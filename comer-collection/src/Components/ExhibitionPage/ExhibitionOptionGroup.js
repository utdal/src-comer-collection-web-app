import { Accordion, AccordionDetails, AccordionSummary, Box, ListItemButton, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@emotion/react";
import { ExpandMoreIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";

export const ExhibitionOptionGroup = ({ id, description, expandedSection, setExpandedSection, children }) => {
    const theme = useTheme();

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
                    background: theme.palette.grey.translucent,
                    zIndex: 100
                }}
            >
                <ListItemButton
                    onClick={() => {
                        setExpandedSection((expandedSection) => (
                            expandedSection === id ? null : id
                        ));
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
ExhibitionOptionGroup.propTypes = {
    children: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    expandedSection: PropTypes.string,
    id: PropTypes.string.isRequired,
    setExpandedSection: PropTypes.func.isRequired
};
