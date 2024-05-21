import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack, Dialog, DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Box
} from "@mui/material";
import { InfoIcon, SearchIcon } from "../../Imports/Icons.js";
import { DataTable } from "../DataTable.js";
import SearchBox from "../SearchBox.js";
import { searchItems } from "../../Helpers/SearchUtilities.js";
import PropTypes from "prop-types";
import { useItemsReducer } from "../../ContextProviders/ManagementPageProvider.js";
import { AssociationManagementPageProvider } from "../../ContextProviders/AssociationManagementPageProvider.js";
import { Association as AssociationClass } from "../../Classes/Association.js";

const computeSecondaryItemsAssigned = (secondaryItemsAll, secondariesByPrimary, primaryItems) => {
    if (primaryItems?.length === 0) { return []; }
    return secondaryItemsAll.filter((si) => {
        return (
            Object.entries(secondariesByPrimary)
                .filter((entry) => primaryItems.map((pi) => pi.id).includes(parseInt(entry[0])))
                .map((entry) => entry[1]).filter((secondaries) => secondaries.map(s => s.id).includes(parseInt(si.id))).length > 0
        );
    });
};

const AssociationTableDisplay = ({ secondaryItems, secondaryItemsResults, tableCaption, primaryItems, AssociationType, children }) => {
    const [secondaryItemsCombinedState, setSecondaryItems] = useItemsReducer();

    useEffect(() => {
        setSecondaryItems(secondaryItems);
    }, [setSecondaryItems, secondaryItems]);

    return (
        <AssociationManagementPageProvider
            {...{
                secondaryItemsCombinedState,
                setSecondaryItems,
                AssociationType
            }}
            relevantPrimaryItems={primaryItems}
        >
            <Box sx={{
                display: "grid",
                gridTemplateAreas: `
                    "caption"
                    "table"
                `,
                gridTemplateRows: tableCaption ? "50px 300px" : "0px 300px"
            }}>
                <Stack direction="row" justifyContent="center" sx={{ gridArea: "caption" }}>
                    {tableCaption && <Typography variant="h5" align="center">{tableCaption}</Typography>}
                </Stack>
                <Box sx={{ gridArea: "table", height: "100%", overflowY: "auto" }}>
                    {(secondaryItemsCombinedState.items.length > 0 && secondaryItemsResults.length > 0 &&
                    children) ||
                    (secondaryItemsCombinedState.items.length > 0 && secondaryItemsResults.length === 0 &&
                        <Box sx={{ width: "100%" }}>
                            <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{ height: "100%", opacity: 0.5 }}>
                                <SearchIcon sx={{ fontSize: "150pt" }} />
                                <Typography variant="h4">No results</Typography>
                            </Stack>
                        </Box>
                    ) || (secondaryItemsCombinedState.items.length === 0 &&
                    <Box sx={{ width: "100%" }}>
                        <Stack direction="column" alignItems="center" justifyContent="center" paddingTop={2} spacing={2} sx={{ height: "100%", opacity: 0.5 }}>
                            <InfoIcon sx={{ fontSize: "150pt" }} />
                            <Typography variant="h4">This list is empty</Typography>
                        </Stack>
                    </Box>
                    )}
                </Box>
            </Box>

        </AssociationManagementPageProvider>
    );
};

AssociationTableDisplay.propTypes = {
    AssociationType: PropTypes.any,
    secondaryItems: PropTypes.array,
    secondaryItemsResults: PropTypes.array,
    tableCaption: PropTypes.string,
    children: PropTypes.node,
    primaryItems: PropTypes.array
};

const assignButtonColumnDefinition = {
    columnDescription: "Assign",
    TableCellComponent: AssociationClass.TableCells.AssignButton
};
const unassignButtonColumnDefinition = {
    columnDescription: "Unassign",
    TableCellComponent: AssociationClass.TableCells.UnassignButton
};

export const AssociationManagementDialog = ({
    Association, editMode, primaryItems,
    secondaryItemsAll,
    dialogInstructions, dialogButtonForSecondaryManagement,
    dialogIsOpen, setDialogIsOpen,
    secondarySearchFields, secondarySearchBoxPlaceholder,
    defaultSortColumn, defaultSortAscending,
    refreshAllItems
}) => {
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
        searchItems(secondarySearchQuery, secondaryItemsAllWithQuantities, secondarySearchFields ?? []

        ), [secondarySearchQuery, secondaryItemsAllWithQuantities, secondarySearchFields]);

    const secondaryItemsAssignedResults = useMemo(() =>
        searchItems(secondarySearchQuery, secondaryItemsAssignedWithQuantities, secondarySearchFields ?? []
        ), [secondarySearchQuery, secondaryItemsAssignedWithQuantities, secondarySearchFields]);

    const allTable = useMemo(() => {
        return (
            <Box sx={{ height: "100%" }}>
                <DataTable
                    tableFields={secondaryTableFieldsAll}
                    defaultSortColumn={defaultSortColumn}
                    defaultSortAscending={defaultSortAscending}
                />
            </Box>
        );
    }, [defaultSortAscending, defaultSortColumn, secondaryTableFieldsAll]);

    const assignedTable = useMemo(() => {
        return <DataTable
            tableFields={secondaryTableFieldsAssignedOnly}
            defaultSortColumn={defaultSortColumn}
            defaultSortAscending={defaultSortAscending}
        />;
    }, [defaultSortAscending, defaultSortColumn, secondaryTableFieldsAssignedOnly]);

    const associationPluralCapitalized = Association.plural.substr(0, 1).toUpperCase() + Association.plural.substr(1);
    const primaryPluralCapitalized = Association.primary.plural.substr(0, 1).toUpperCase() + Association.primary.plural.substr(1);
    const secondaryPluralCapitalized = Association.secondary.plural.substr(0, 1).toUpperCase() + Association.secondary.plural.substr(1);

    const summarizedSelection = (
        (primaryItems.length === 1 &&
            <b>{primaryItems[0].safe_display_name}</b>
        ) || (primaryItems.length > 1 &&
            `${primaryItems.length} Selected ${primaryPluralCapitalized}`
        )
    );

    return (
        <Dialog fullWidth={true} maxWidth={editMode ? "lg" : "md"} sx={{ zIndex: 10000 }}
            open={dialogIsOpen} disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason === "backdropClick") {
                    return;
                }
                setDialogIsOpen(false);
            }}
        >
            <DialogTitle textAlign="center" variant="h4" sx={{ textOverflow: "ellipsis", wordWrap: "break-word" }}>
                {editMode ? "Manage" : "View"} {associationPluralCapitalized} for {summarizedSelection}
            </DialogTitle>
            <DialogContent>
                <DialogContentText variant="body1">{dialogInstructions}</DialogContentText>
                <Stack direction="column" padding={1} spacing={2}>
                    {secondarySearchFields?.length > 0 && (
                        <SearchBox width="100%" placeholder={secondarySearchBoxPlaceholder ?? "Search"}
                            searchQuery={secondarySearchQuery}
                            setSearchQuery={setSecondarySearchQuery}
                        />
                    )}
                    <Box spacing={2} sx={{
                        display: "grid",
                        gridTemplateAreas: `
                    "all divider assigned"
                `,
                        gridTemplateColumns: editMode ? "1fr 30px 1fr" : "0px 0px 1fr"
                    }}>
                        {
                            editMode && (
                                <>
                                    <Box sx={{ gridArea: "all" }}>
                                        <AssociationTableDisplay
                                            secondaryItems={secondaryItemsAllWithQuantities}
                                            {...{ primaryItems }}
                                            secondaryItemsResults={secondaryItemsAllResults}
                                            tableCaption={`All ${secondaryPluralCapitalized}`}
                                            AssociationType={Association}
                                        >
                                            {allTable}
                                        </AssociationTableDisplay>
                                    </Box>
                                </>
                            )
                        }
                        <Box sx={{ gridArea: "assigned" }}>
                            <AssociationTableDisplay
                                secondaryItems={secondaryItemsAssignedWithQuantities} secondaryItemsResults={secondaryItemsAssignedResults}
                                {...{ primaryItems }}
                                tableCaption={editMode ? `Current ${secondaryPluralCapitalized} for ${summarizedSelection}` : ""}
                                AssociationType={Association}
                            >
                                {assignedTable}
                            </AssociationTableDisplay>
                        </Box>

                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={1} justifyContent="space-between" width="100%">
                    {dialogButtonForSecondaryManagement}
                    <Button type="submit" sx={{
                        width: "30%"
                    }} color="primary" variant="contained" size="large"
                    onClick={() => {
                        setDialogIsOpen(false);
                    }}
                    >
                        <Typography variant="body1">Close</Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

AssociationManagementDialog.propTypes = {
    Association: PropTypes.any,
    editMode: PropTypes.bool.isRequired,
    primaryItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    secondaryItemsAll: PropTypes.arrayOf(PropTypes.object).isRequired,
    dialogInstructions: PropTypes.string,
    dialogButtonForSecondaryManagement: PropTypes.element.isRequired,
    dialogIsOpen: PropTypes.bool.isRequired,
    setDialogIsOpen: PropTypes.func.isRequired,
    secondarySearchFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    secondarySearchBoxPlaceholder: PropTypes.string,
    defaultSortAscending: PropTypes.bool,
    defaultSortColumn: PropTypes.string,
    refreshAllItems: PropTypes.func
};
