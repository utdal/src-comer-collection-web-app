import React from "react";
import { useSnackbar } from "../../../ContextProviders/AppFeatures.js";
import { useAssociationType, useRelevantPrimaryItems } from "../../../ContextProviders/AssociationManagementPageProvider.js";
import { User } from "../../../Classes/Entities/User.js";
import { capitalized } from "../../../Classes/Entity.js";
import { Button, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const UnassignButton = () => {
    const showSnackbar = useSnackbar();
    const secondaryItem = useTableCellItem();
    const primaryItems = useRelevantPrimaryItems();
    const AssociationType = useAssociationType();
    const buttonColor = AssociationType.secondary === User && secondaryItem.is_admin_or_collection_manager ? "secondary" : "primary";
    const quantity = secondaryItem.quantity_assigned;
    const buttonText = (
        primaryItems.length === 1
            ? `${capitalized(AssociationType.unassignPresent)} ${AssociationType.primary.singular}`
            : `${capitalized(AssociationType.unassignPresent)} ${quantity} ${quantity === 1 ? AssociationType.primary.singular : AssociationType.primary.plural}`
    );
    return (
        <Button
            color={buttonColor}
            onClick={() => {
                const primaryIds = primaryItems.map((p) => p.id);
                AssociationType.handleUnassign(primaryIds, [secondaryItem.id]).then((msg) => {
                    showSnackbar(msg, "success");
                // refreshAllItems();
                }).catch((err) => {
                    showSnackbar(err.message, "error");
                });
            }}
            startIcon={<AssociationType.UnassignIcon />}
            variant="outlined"
        >
            <Typography variant="body1">
                {buttonText}
            </Typography>
        </Button>
    );
};
