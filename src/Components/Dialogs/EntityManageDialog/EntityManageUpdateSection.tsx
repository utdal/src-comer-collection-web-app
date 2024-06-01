import React, { useCallback, useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import SearchBox from "../../SearchBox";
import PaginationSummary from "../../PaginationSummary/PaginationSummary.js";
import RefreshButton from "../../Buttons/RefreshButton.js";
import DataTable from "../../DataTable/DataTable.js";
import { useEntity, useVisibilityStatuses } from "../../../ContextProviders/ManagementPageProvider";
import { FullPageMessage } from "../../FullPageMessage";
import { DeleteIcon } from "../../../Imports/Icons";
import { itemsCombinedStatePropTypeShape } from "../../../Classes/Entity";
import { doesItemMatchSearchQuery } from "../../../Helpers/SearchUtilities.js";
import type { Item, ItemsCombinedState } from "../../..";

const EntityManageUpdateSection = ({ dialogItemsCombinedState }: {
    readonly dialogItemsCombinedState: ItemsCombinedState;
}): React.JSX.Element => {
    const Entity = useEntity();

    const [itemSearchQuery, setItemSearchQuery] = useState("");

    const [, filterDialogItems] = useVisibilityStatuses();

    const itemFilterFunction = useCallback((item: Item) => {
        return (
            doesItemMatchSearchQuery(itemSearchQuery, item, Entity.searchBoxFields)
        );
    }, [itemSearchQuery, Entity.searchBoxFields]);

    useEffect(() => {
        filterDialogItems(itemFilterFunction);
    }, [filterDialogItems, itemFilterFunction]);

    return (
        <Box sx={{ gridArea: "update", overflowX: "auto" }}>
            {dialogItemsCombinedState.itemCounts.all
                ? (
                    <Stack
                        spacing={2}
                        sx={{ height: "300px" }}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            justifyContent="space-between"
                            spacing={2}
                        >

                            <SearchBox
                                searchQuery={itemSearchQuery}
                                setSearchQuery={setItemSearchQuery}
                                width="40%"
                            />

                            <PaginationSummary />

                            <RefreshButton />

                        </Stack>

                        <DataTable
                            rowSelectionEnabled
                            smallCheckboxes
                            tableFields={Entity.tableFields}
                        />

                    </Stack>
                )
                : (
                    Entity.isTrash
                        ? (
                            <FullPageMessage
                                Icon={DeleteIcon as React.ElementType}
                                message={`No ${Entity.plural} in trash`}
                            />
                        )
                        : null
                ) }
        </Box>
    );
};

EntityManageUpdateSection.propTypes = {
    dialogItemsCombinedState: itemsCombinedStatePropTypeShape
};

export default EntityManageUpdateSection;
