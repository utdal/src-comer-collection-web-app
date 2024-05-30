import React from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import SearchBox from "../../SearchBox.js";
import PaginationSummary from "../../PaginationSummary/PaginationSummary.js";
import { RefreshButton } from "../../Buttons/RefreshButton.js";
import { DataTable } from "../../DataTable/DataTable.js";
import { useEntity } from "../../../ContextProviders/ManagementPageProvider.js";
import { FullPageMessage } from "../../FullPageMessage.js";
import { DeleteIcon } from "../../../Imports/Icons.js";
import { itemsCombinedStatePropTypeShape } from "../../../Classes/Entity.js";

const EntityManageUpdateSection = ({ dialogItemsCombinedState, itemSearchQuery, setItemSearchQuery }) => {
    const Entity = useEntity();
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
    dialogItemsCombinedState: itemsCombinedStatePropTypeShape,
    itemSearchQuery: PropTypes.string,
    setItemSearchQuery: PropTypes.func
};

export default EntityManageUpdateSection;
