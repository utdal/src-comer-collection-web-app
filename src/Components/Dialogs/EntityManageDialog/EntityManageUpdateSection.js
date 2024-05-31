import React, { useCallback, useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import SearchBox from "../../SearchBox.js";
import PaginationSummary from "../../PaginationSummary/PaginationSummary.js";
import { RefreshButton } from "../../Buttons/RefreshButton.js";
import { DataTable } from "../../DataTable/DataTable.js";
import { useEntity, useVisibilityStatuses } from "../../../ContextProviders/ManagementPageProvider.js";
import { FullPageMessage } from "../../FullPageMessage.js";
import { DeleteIcon } from "../../../Imports/Icons.js";
import { itemsCombinedStatePropTypeShape } from "../../../Classes/Entity.ts";
import { doesItemMatchSearchQuery } from "../../../Helpers/SearchUtilities.js";

const EntityManageUpdateSection = ({ dialogItemsCombinedState }) => {
    const Entity = useEntity();

    const [itemSearchQuery, setItemSearchQuery] = useState("");

    const [, filterDialogItems] = useVisibilityStatuses();

    const itemFilterFunction = useCallback((item) => {
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
                            NoContentIcon="div"
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
                                Icon={DeleteIcon}
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
