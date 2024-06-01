import React from "react";
import { Stack, Typography, Select, ListItemButton, Divider } from "@mui/material";
import { CheckIcon, RemoveCircleOutlineIcon } from "../../Imports/Icons.js";
import type { Item } from "../../index.js";

export const SecondaryFilterMenu = ({ filterValue, setFilterValue, secondaries, helpMessage, emptyMessage, nullMessage, displayFunction, sortFunction, SecondaryIcon }: {
    readonly filterValue: Item | null;
    readonly setFilterValue: React.Dispatch<React.SetStateAction<Item | null>>;
    readonly secondaries: Item[];
    readonly helpMessage: string;
    readonly emptyMessage: string;
    readonly nullMessage: string;
    readonly displayFunction: (item: Item) => React.ReactNode;
    readonly sortFunction: (a: Item, b: Item) => number;
    readonly SecondaryIcon: React.ElementType;
}): React.JSX.Element => {
    return (
        <Select
            displayEmpty
            placeholder="All secondaries"
            renderValue={(selected): React.JSX.Element => {
                return (
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <SecondaryIcon />

                        {secondaries.find((i) => i.id === selected)
                            ? (
                                <Typography
                                    sx={{ minWidth: "120px" }}
                                    variant="body1"
                                >
                                    {`${secondaries.find((c) => c.id === selected)?.safe_display_name as string}`}
                                </Typography>
                            )
                            : (
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

            {secondaries.length > 0
                ? (
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
                )
                : (
                    <div>
                        <ListItemButton
                            key=""
                            onClick={(): void => {
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
                                onClick={(): void => {
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
