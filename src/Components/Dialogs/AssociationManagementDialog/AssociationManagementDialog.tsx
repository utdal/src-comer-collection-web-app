import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack, DialogTitle,
    DialogContent,
    DialogActions,
    Button, Box
} from "@mui/material";
import DataTable from "../../DataTable/DataTable.js";
import SearchBox from "../../SearchBox.js";
import AssignButton from "../../TableCells/Association/AssignButton.js";
import UnassignButton from "../../TableCells/Association/UnassignButton.js";
import computeSecondaryItemsAssigned from "../../../Helpers/computeSecondaryItemsAssigned.js";
import AssociationTableDisplay from "./AssociationTableDisplay.js";
import { AssociationManagementPageProvider } from "../../../ContextProviders/AssociationManagementPageProvider.js";
import { useItemsReducer, useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import PersistentDialog from "../PersistentDialog.js";
import SecondaryManagementButton from "../../Buttons/SecondaryManagementButton.js";
import type { AssociationType, DialogState, DialogStateMultipleUnderlyingItems, Item, TableFieldDefinition } from "../../../index.js";

const assignButtonColumnDefinition: TableFieldDefinition = {
    columnDescription: "Assign",
    TableCellComponent: AssignButton as React.ElementType
};
const unassignButtonColumnDefinition: TableFieldDefinition = {
    columnDescription: "Unassign",
    TableCellComponent: UnassignButton as React.ElementType
};

export const AssociationManagementDialog = ({
    Association, editMode,
    secondaryItemsAll,
    handleSwitchToSecondary,
    dialogState,
    defaultSortColumn = "ID", defaultSortAscending = true
}: {
    readonly dialogState: DialogState;
    readonly Association: AssociationType;
    readonly defaultSortAscending?: boolean;
    readonly defaultSortColumn?: string;
    readonly secondaryItemsAll: Item[];
    readonly editMode: boolean;
    readonly handleSwitchToSecondary: () => void;
}): React.JSX.Element => {
    const [, secondaryItemsCallbacks] = useItemsReducer([]);

    const {
        setItems: setSecondaryItems
    } = secondaryItemsCallbacks;

    const { dialogIsOpen, underlyingItems } = dialogState as DialogStateMultipleUnderlyingItems;
    const primaryItems = underlyingItems;

    const { closeDialogByIntent } = useManagementCallbacks();

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

    const [secondariesByPrimary, setSecondariesByPrimary] = useState({} as Record<number, Item[]>);

    useEffect(() => {
        setSecondariesByPrimary(primaryItems.reduce((acc: Record<number, Item[]>, cur) => {
            acc[cur.id] = cur[Association.secondaryFieldInPrimary] as Item[];
            return acc;
        }, {}));
    }, [Association, primaryItems]);

    const [secondarySearchQuery, setSecondarySearchQuery] = useState("");

    const handleCloseDialog = useCallback(() => {
        closeDialogByIntent("image-full-screen-preview"); // change later
    }, [closeDialogByIntent]);

    const getQuantityAssigned = useCallback((secondary: Item) => {
        return Object.entries(secondariesByPrimary)
            .filter(([primaryIdAsString, secondaries]: [string, Item[]]) => (
                primaryItems.map((pi) => pi.id).includes(parseInt(primaryIdAsString)) &&
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

    // const secondaryItemsAllResults = useMemo(() =>
    //     searchItems(secondarySearchQuery, secondaryItemsAllWithQuantities, Association.secondarySearchBoxFields ?? []

    //     ), [secondarySearchQuery, secondaryItemsAllWithQuantities, Association.secondarySearchBoxFields]);

    // const secondaryItemsAssignedResults = useMemo(() =>
    //     searchItems(secondarySearchQuery, secondaryItemsAssignedWithQuantities, Association.secondarySearchBoxFields ?? []
    //     ), [secondarySearchQuery, secondaryItemsAssignedWithQuantities, Association.secondarySearchBoxFields]);

    const secondaryItemsAllResults = secondaryItemsAllWithQuantities;
    const secondaryItemsAssignedResults = secondaryItemsAssignedWithQuantities;
    console.log(secondaryItemsAllResults);
    console.log(secondaryItemsAssignedResults);

    const allTable = useMemo(() => {
        return (
            <Box sx={{ height: "100%" }}>
                <DataTable
                    defaultSortAscending={defaultSortAscending}
                    defaultSortColumn={defaultSortColumn}
                    rowSelectionEnabled
                    tableFields={secondaryTableFieldsAll}
                />
            </Box>
        );
    }, [defaultSortAscending, defaultSortColumn, secondaryTableFieldsAll]);

    const assignedTable = useMemo(() => (
        <DataTable
            defaultSortAscending={defaultSortAscending}
            defaultSortColumn={defaultSortColumn}
            rowSelectionEnabled
            tableFields={secondaryTableFieldsAssignedOnly}
        />
    ), [defaultSortAscending, defaultSortColumn, secondaryTableFieldsAssignedOnly]);

    const associationPluralCapitalized = Association.plural.substr(0, 1).toUpperCase() + Association.plural.substr(1);
    const primaryPluralCapitalized = Association.primary.plural.substr(0, 1).toUpperCase() + Association.primary.plural.substr(1);
    const secondaryPluralCapitalized = Association.secondary.plural.substr(0, 1).toUpperCase() + Association.secondary.plural.substr(1);

    const summarizedSelection = (
        primaryItems.length === 1
            ? (
                `${primaryItems[0].safe_display_name}`
            )
            : (
                `${primaryItems.length} Selected ${primaryPluralCapitalized}`
            )
    );

    return (
        <AssociationManagementPageProvider
            AssociationType={Association}
            relevantPrimaryItems={primaryItems}
        >
            <PersistentDialog
                maxWidth={editMode ? "lg" : "md"}
                onClose={handleCloseDialog}
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
                        {Association.secondarySearchBoxFields.length > 0 && (
                            <SearchBox
                                searchQuery={secondarySearchQuery}
                                setSearchQuery={setSecondarySearchQuery}
                                width="100%"
                            />
                        )}

                        <Box
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
                                                // secondaryItems={secondaryItemsAllWithQuantities}
                                                // secondaryItemsResults={secondaryItemsAllResults}
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
                                    // secondaryItems={secondaryItemsAssignedWithQuantities}
                                    // secondaryItemsResults={secondaryItemsAssignedResults}
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

export default AssociationManagementDialog;
