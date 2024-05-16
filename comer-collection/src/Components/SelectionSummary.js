import React, { useCallback } from "react";
import {
    Stack,
    Button,
    Typography
} from "@mui/material";
import { CheckIcon, ArrowUpwardIcon, DeselectIcon } from "../Imports/Icons.js";
import PropTypes from "prop-types";
import { useItems, useSelectedItems, useSelectedVisibleItems, useVisibleItems } from "../ContextProviders/ManagementPageProvider.js";

export const SelectionSummary = ({ entitySingular, entityPlural }) => {
    const [items] = useItems();
    const [selectedItems, setSelectedItems] = useSelectedItems();
    const [visibleItems] = useVisibleItems();
    const selectedVisibleItems = useSelectedVisibleItems();

    const clearSelectedItems = useCallback(() => {
        setSelectedItems([]);
    }, [setSelectedItems]);

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            {(selectedItems.length > 0 &&
                <CheckIcon fontSize="large" sx={{ opacity: 0.5 }} />
            ) || (selectedItems.length === 0 &&
                <ArrowUpwardIcon fontSize="large" sx={{ opacity: 0.5 }} />
            )}
            <Stack direction="column">
                <Typography variant="body1" sx={{ opacity: 0.5 }}>
                    {visibleItems.length < items.length
                        ? `Showing ${visibleItems.length} of ${items.length} ${items.length === 1 ? entitySingular : entityPlural}`
                        : `${items.length} ${items.length === 1 ? entitySingular : entityPlural}`}
                </Typography>
                {(selectedItems.length > 0 &&
                    <Typography variant="body1">{selectedItems.length} {selectedItems.length === 1 ? entitySingular : entityPlural} selected
                        {selectedVisibleItems.length < selectedItems.length
                            ? ` (${selectedVisibleItems.length} shown)`
                            : ""
                        }
                    </Typography>
                ) || (selectedItems.length === 0 &&
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>Select items to use bulk actions</Typography>
                )}

            </Stack>
            {selectedItems.length > 0 && (
                <Button variant="outlined" startIcon={<DeselectIcon />} onClick={clearSelectedItems}>
                    <Typography variant="body1">Clear Selection</Typography>
                </Button>
            )}
        </Stack>
    );
};

SelectionSummary.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    setSelectedItems: PropTypes.func,
    visibleItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    entitySingular: PropTypes.string,
    entityPlural: PropTypes.string
};
