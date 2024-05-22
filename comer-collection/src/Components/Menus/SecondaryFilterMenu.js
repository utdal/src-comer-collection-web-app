import React from "react";
import { Stack, Typography, Select, ListItemButton, Divider } from "@mui/material";
import { CheckIcon, RemoveCircleOutlineIcon } from "../../Imports/Icons.js";
import PropTypes from "prop-types";
import { entityPropTypeShape } from "../../Classes/Entity.js";

export const SecondaryFilterMenu = ({ filterValue, setFilterValue, secondaries, helpMessage, emptyMessage, nullMessage, displayFunction, sortFunction, SecondaryIcon }) => {
    return (
        <Select
            displayEmpty
            placeholder="All secondaries"
            renderValue={(selected) => {
                return (
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <SecondaryIcon />

                        {(secondaries.find((i) => i.id === selected) &&
                            <Typography
                                sx={{ minWidth: "120px" }}
                                variant="body1"
                            >
                                {secondaries.find((c) => c.id === selected)?.safe_display_name}
                            </Typography>
                        ) || (
                            <Typography
                                sx={{ minWidth: "120px", opacity: 0.5 }}
                                variant="body1"
                            >
                                {helpMessage}
                            </Typography>
                        )}
                    </Stack>
                );
            }}
            sx={{
                wordWrap: "break-word",
                width: "300px"
            }}
            value={filterValue?.id ?? ""}
            variant="outlined"
        >

            {(!secondaries.length &&
                <ListItemButton
                    disabled
                    key=""
                    value=""
                >
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <RemoveCircleOutlineIcon />

                        <Typography
                            sx={{ minWidth: "120px" }}
                            variant="body1"
                        >
                            {emptyMessage}
                        </Typography>
                    </Stack>
                </ListItemButton>
            ) || (secondaries.length &&
                <div>
                    <ListItemButton
                        key=""
                        onClick={() => {
                            setFilterValue(null);
                        }}
                        value=""
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                        >
                            <CheckIcon sx={{ visibility: filterValue ? "hidden" : "" }} />

                            <Typography
                                sx={{ minWidth: "120px" }}
                                variant="body1"
                            >
                                {nullMessage}
                            </Typography>
                        </Stack>
                    </ListItemButton>

                    <Divider sx={{ padding: "4px" }} />

                    {secondaries.sort(sortFunction).map((secondary) => (
                        <ListItemButton
                            key={secondary.id}
                            onClick={() => {
                                setFilterValue(secondary);
                            }}
                            value={secondary.id}
                        >
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={2}
                            >
                                <CheckIcon sx={{ visibility: filterValue?.id === secondary.id ? "" : "hidden" }} />

                                <Stack
                                    alignItems="left"
                                    direction="column"
                                    spacing={0}
                                    sx={{}}
                                >
                                    {displayFunction(secondary)}
                                </Stack>
                            </Stack>
                        </ListItemButton>
                    ))}
                </div>
            )}
        </Select>
    );
};

SecondaryFilterMenu.propTypes = {
    SecondaryIcon: PropTypes.elementType.isRequired,
    displayFunction: PropTypes.func.isRequired,
    emptyMessage: PropTypes.string.isRequired,
    filterValue: PropTypes.shape(entityPropTypeShape).isRequired,
    helpMessage: PropTypes.string.isRequired,
    nullMessage: PropTypes.string.isRequired,
    secondaries: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    setFilterValue: PropTypes.func.isRequired,
    sortFunction: PropTypes.func.isRequired
};
