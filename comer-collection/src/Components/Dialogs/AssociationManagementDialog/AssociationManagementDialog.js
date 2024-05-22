import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Stack, Dialog, DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, DialogContentText, Box
} from "@mui/material";
import { DataTable } from "../../DataTable/DataTable.js";
import SearchBox from "../../SearchBox.js";
import { searchItems } from "../../../Helpers/SearchUtilities.js";
import PropTypes from "prop-types";
import { AssignButton } from "../../TableCells/Association/AssignButton.js";
import { UnassignButton } from "../../TableCells/Association/UnassignButton.js";
import { computeSecondaryItemsAssigned } from "../../../Helpers/computeSecondaryItemsAssigned.js";
import { AssociationTableDisplay } from "./AssociationTableDisplay.js";
import { entityPropTypeShape } from "../../../Classes/Entity.js";

const assignButtonColumnDefinition = {
    columnDescription: "Assign",
    TableCellComponent: AssignButton
};
const unassignButtonColumnDefinition = {
    columnDescription: "Unassign",
    TableCellComponent: UnassignButton
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
        <Dialog
            disableEscapeKeyDown
            fullWidth
            maxWidth={editMode ? "lg" : "md"}
            onClose={(event, reason) => {
                if (reason === "backdropClick") {
                    return;
                }
                setDialogIsOpen(false);
            }}
            open={dialogIsOpen}
            sx={{ zIndex: 10000 }}
        >
            <DialogTitle
                sx={{ textOverflow: "ellipsis", wordWrap: "break-word" }}
                textAlign="center"
                variant="h4"
            >
                {editMode ? "Manage" : "View"}

                {associationPluralCapitalized}

                {" "}

                for
                {summarizedSelection}
            </DialogTitle>

            <DialogContent>
                <DialogContentText variant="body1">
                    {dialogInstructions}
                </DialogContentText>

                <Stack
                    direction="column"
                    padding={1}
                    spacing={2}
                >
                    {secondarySearchFields?.length > 0 && (
                        <SearchBox
                            placeholder={secondarySearchBoxPlaceholder ?? "Search"}
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
                    {dialogButtonForSecondaryManagement}

                    <Button
                        color="primary"
                        onClick={() => {
                            setDialogIsOpen(false);
                        }}
                        size="large"
                        sx={{
                            width: "30%"
                        }}
                        type="submit"
                        variant="contained"
                    >
                        <Typography variant="body1">
                            Close
                        </Typography>
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

AssociationManagementDialog.propTypes = {
    Association: PropTypes.node.isRequired,
    defaultSortAscending: PropTypes.bool,
    defaultSortColumn: PropTypes.string.isRequired,
    dialogButtonForSecondaryManagement: PropTypes.element.isRequired,
    dialogInstructions: PropTypes.string,
    dialogIsOpen: PropTypes.bool.isRequired,
    editMode: PropTypes.bool.isRequired,
    primaryItems: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    refreshAllItems: PropTypes.func.isRequired,
    secondaryItemsAll: PropTypes.arrayOf(entityPropTypeShape).isRequired,
    secondarySearchBoxPlaceholder: PropTypes.string.isRequired,
    secondarySearchFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    setDialogIsOpen: PropTypes.func.isRequired
};

AssociationManagementDialog.defaultProps = {
    defaultSortAscending: false,
    dialogInstructions: ""
};
