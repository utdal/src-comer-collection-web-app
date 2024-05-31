import React, { useCallback } from "react";
import {
    Stack,
    Button,
    Typography
} from "@mui/material";
import { CheckIcon, ArrowUpwardIcon, DeselectIcon } from "../Imports/Icons.js";
import { useEntity, useItemCounts, useSelectionStatuses } from "../ContextProviders/ManagementPageProvider.js";

export const SelectionSummary = () => {
    const [, , setSelectedItems] = useSelectionStatuses();
    const Entity = useEntity();
    const itemCounts = useItemCounts();

    const clearSelectedItems = useCallback(() => {
        setSelectedItems([]);
    }, [setSelectedItems]);

    if (itemCounts.all === 0) {
        return null;
    }

    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={2}
        >
            {(itemCounts.selected > 0 &&
                <CheckIcon
                    fontSize="large"
                    sx={{ opacity: 0.5 }}
                />
            ) || (itemCounts.selected === 0 &&
                <ArrowUpwardIcon
                    fontSize="large"
                    sx={{ opacity: 0.5 }}
                />
            )}

            <Stack direction="column">
                <Typography
                    sx={{ opacity: 0.5 }}
                    variant="body1"
                >
                    {itemCounts.visible < itemCounts.all
                        ? `Showing ${itemCounts.visible} of ${itemCounts.all} ${itemCounts.all === 1 ? Entity.singular : Entity.plural}`
                        : `${itemCounts.all} ${itemCounts.all === 1 ? Entity.singular : Entity.plural}`}
                </Typography>

                {(itemCounts.selected > 0 &&
                    <Typography variant="body1">
                        {itemCounts.selected}

                        {" "}

                        {itemCounts.selected === 1 ? Entity.singular : Entity.plural}

                        {" "}

                        selected

                        {itemCounts.selectedAndVisible < itemCounts.selected
                            ? ` (${itemCounts.selectedAndVisible} shown)`
                            : ""}
                    </Typography>
                ) || (itemCounts.selected === 0 &&
                    <Typography
                        sx={{ opacity: 0.5 }}
                        variant="body1"
                    >
                        Select items to use bulk actions
                    </Typography>
                )}

            </Stack>

            {itemCounts.selected > 0 && (
                <Button
                    onClick={clearSelectedItems}
                    startIcon={<DeselectIcon />}
                    variant="outlined"
                >
                    Clear
                </Button>
            )}
        </Stack>
    );
};
