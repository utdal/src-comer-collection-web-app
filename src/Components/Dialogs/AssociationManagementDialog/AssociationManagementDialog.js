import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, Box
} from "@mui/material";
import { DataTable } from "../../DataTable/DataTable.js";
import SearchBox from "../../SearchBox";
import { searchItems } from "../../../Helpers/SearchUtilities.js";
import PropTypes from "prop-types";
import { AssignButton } from "../../TableCells/Association/AssignButton.js";
import { UnassignButton } from "../../TableCells/Association/UnassignButton.js";
import { computeSecondaryItemsAssigned } from "../../../Helpers/computeSecondaryItemsAssigned.js";
import { AssociationTableDisplay } from "./AssociationTableDisplay.js";
import { entityPropTypeShape } from "../../../Classes/Entity.ts";
import { AssociationManagementPageProvider } from "../../../ContextProviders/AssociationManagementPageProvider";
import { useItemsReducer, useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider";
import { DialogStateOld } from "../../../Classes/DialogState.js";
import { PersistentDialog } from "../PersistentDialog.js";
import SecondaryManagementButton from "../../Buttons/SecondaryManagementButton.js";

const assignButtonColumnDefinition = {
    columnDescription: "Assign",
    TableCellComponent: AssignButton
};
const unassignButtonColumnDefinition = {
    columnDescription: "Unassign",
    TableCellComponent: UnassignButton
};

/**
 * @param {{
 *  dialogState: DialogStateOld
 * }} props
 */
export const AssociationManagementDialog = ({
    Association, editMode,
    secondaryItemsAll,
    handleSwitchToSecondary,
    dialogState,
    defaultSortColumn, defaultSortAscending
}) => {
    const [secondaryItemsCombinedState, secondaryItemsCallbacks] = useItemsReducer([]);

    const {
        setItems: setSecondaryItems,
        setSelectedItems: setSelectedSecondaryItems
    } = secondaryItemsCallbacks;

    const { dialogIsOpen, dialogItems: primaryItems, closeDialog } = dialogState;

    const { handleRefresh } = useManagementCallbacks();

    useEffect(() => {
        setSecondaryItems(secondaryItemsAll);
    }, [secondaryItemsAll, setSecondaryItems]);

    const secondaryTableFieldsAll = useMemo(() => (
        editMode
            ? [...Association.tableFields, assignButtonColumnDefinition]
            : Association.tableFields
    ), [Association.tableFields, editMode]);

    const secondaryTableFieldsAssignedOnly = useMemo(() => (
        editMode
            ? [...Association.tableFields, unassignButtonColumnDefinition]
            : Association.tableFields
    ), [Association.tableFields, editMode]);

    const [secondariesByPrimary, setSecondariesByPrimary] = useState({});

    useEffect(() => {
        setSecondariesByPrimary(primaryItems.reduce((acc, cur) => {
            acc[cur.id] = cur[Association.secondaryFieldInPrimary];
            return acc;
        }, {}));
    }, [Association, primaryItems]);

    const [secondarySearchQuery, setSecondarySearchQuery] = useState("");

    const handleCloseDialog = useCallback(() => {
        handleRefresh();
        closeDialog();
    }, [closeDialog, handleRefresh]);

    const getQuantityAssigned = useCallback((secondary) => {
        return Object.entries(secondariesByPrimary)
            .filter(([primaryId]) => (
                primaryItems.map((pi) => pi.id).includes(parseInt(primaryId))
            ))
            .filter(([, secondaries]) => (
                secondaries.map((si) => si.id).includes(secondary.id)
            )).length;
    }, [secondariesByPrimary, primaryItems]);

    const secondaryItemsAssigned = useMemo(() => {
        return computeSecondaryItemsAssigned(secondaryItemsAll, secondariesByPrimary, primaryItems);
    }, [secondaryItemsAll, secondariesByPrimary, primaryItems]);

    const secondaryItemsAllWithQuantities = secondaryItemsAll.map((si) => {
        return { ...si, quantity_assigned: getQuantityAssigned(si) };
    });

    const secondaryItemsAssignedWithQuantities = secondaryItemsAssigned.map((si) => {
        return { ...si, quantity_assigned: getQuantityAssigned(si) };
    });

    const secondaryItemsAllResults = useMemo(() =>
        searchItems(secondarySearchQuery, secondaryItemsAllWithQuantities, Association.secondarySearchBoxFields ?? []

        ), [secondarySearchQuery, secondaryItemsAllWithQuantities, Association.secondarySearchBoxFields]);

    const secondaryItemsAssignedResults = useMemo(() =>
        searchItems(secondarySearchQuery, secondaryItemsAssignedWithQuantities, Association.secondarySearchBoxFields ?? []
        ), [secondarySearchQuery, secondaryItemsAssignedWithQuantities, Association.secondarySearchBoxFields]);

    const allTable = useMemo(() => {
        return (
            <Box sx={{ height: "100%" }}>
                <DataTable
                    defaultSortAscending={defaultSortAscending}
                    defaultSortColumn={defaultSortColumn}
                    tableFields={secondaryTableFieldsAll}
                />
            </Box>
        );
    }, [defaultSortAscending, defaultSortColumn, secondaryTableFieldsAll]);

    const assignedTable = useMemo(() => (
        <DataTable
            defaultSortAscending={defaultSortAscending}
            defaultSortColumn={defaultSortColumn}
            tableFields={secondaryTableFieldsAssignedOnly}
        />
    ), [defaultSortAscending, defaultSortColumn, secondaryTableFieldsAssignedOnly]);

    const associationPluralCapitalized = Association.plural.substr(0, 1).toUpperCase() + Association.plural.substr(1);
    const primaryPluralCapitalized = Association.primary.plural.substr(0, 1).toUpperCase() + Association.primary.plural.substr(1);
    const secondaryPluralCapitalized = Association.secondary.plural.substr(0, 1).toUpperCase() + Association.secondary.plural.substr(1);

    const summarizedSelection = (
        (primaryItems.length === 1 &&
            <b>
                {primaryItems[0].safe_display_name}
            </b>
        ) || (primaryItems.length > 1 &&
            `${primaryItems.length} Selected ${primaryPluralCapitalized}`
        )
    );

    return (
        <AssociationManagementPageProvider
            AssociationType={Association}
            relevantPrimaryItems={primaryItems}
            secondaryItemsCallbacks={secondaryItemsCallbacks}
            secondaryItemsCombinedState={secondaryItemsCombinedState}
            setSecondaryItems={setSecondaryItems}
            setSelectedSecondaryItems={setSelectedSecondaryItems}
        >
            <PersistentDialog
                maxWidth={editMode ? "lg" : "md"}
                onClose={closeDialog}
                open={dialogIsOpen}
            >
                <DialogTitle>
                    {editMode ? "Manage" : "View"}

                    {" "}

                    {associationPluralCapitalized}

                    {" for "}

                    {summarizedSelection}
                </DialogTitle>

                <DialogContent>

                    <Stack
                        direction="column"
                        padding={1}
                        spacing={2}
                    >
                        {Association.secondarySearchBoxFields?.length > 0 && (
                            <SearchBox
                                placeholder={Association.secondarySearchBoxPlaceholder ?? "Search"}
                                searchQuery={secondarySearchQuery}
                                setSearchQuery={setSecondarySearchQuery}
                                width="100%"
                            />
                        )}

                        <Box
                            spacing={2}
                            sx={{
                                display: "grid",
                                gridTemplateAreas: `
                                    "all divider assigned"
                                `,
                                gridTemplateColumns: editMode ? "1fr 30px 1fr" : "0px 0px 1fr"
                            }}
                        >
                            {
                                editMode
                                    ? (
                                        <Box sx={{ gridArea: "all" }}>
                                            <AssociationTableDisplay
                                                AssociationType={Association}
                                                primaryItems={primaryItems}
                                                secondaryItems={secondaryItemsAllWithQuantities}
                                                secondaryItemsResults={secondaryItemsAllResults}
                                                tableCaption={`All ${secondaryPluralCapitalized}`}
                                            >
                                                {allTable}
                                            </AssociationTableDisplay>
                                        </Box>
                                    )
                                    : null
                            }

                            <Box sx={{ gridArea: "assigned" }}>
                                <AssociationTableDisplay
                                    AssociationType={Association}
                                    primaryItems={primaryItems}
                                    secondaryItems={secondaryItemsAssignedWithQuantities}
                                    secondaryItemsResults={secondaryItemsAssignedResults}
                                    tableCaption={editMode ? `Current ${secondaryPluralCapitalized} for ${summarizedSelection}` : ""}
                                >
                                    {assignedTable}
                                </AssociationTableDisplay>
                            </Box>

                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={1}
                        width="100%"
                    >
                        <SecondaryManagementButton
                            handleSwitchToSecondary={handleSwitchToSecondary}
                        />

                        <Button
                            color="primary"
                            onClick={handleCloseDialog}
                            size="large"
                            sx={{
                                width: "30%"
                            }}
                            type="submit"
                            variant="contained"
                        >
                            Close
                        </Button>
                    </Stack>
                </DialogActions>
            </PersistentDialog>
        </AssociationManagementPageProvider>
    );
};

AssociationManagementDialog.propTypes = {
    Association: PropTypes.func.isRequired,
    defaultSortAscending: PropTypes.bool,
    defaultSortColumn: PropTypes.string,
    dialogState: PropTypes.instanceOf(DialogStateOld),
    editMode: PropTypes.bool,
    handleSwitchToSecondary: PropTypes.func.isRequired,
    secondaryItemsAll: PropTypes.arrayOf(entityPropTypeShape).isRequired
};
