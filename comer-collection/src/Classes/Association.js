import React from "react";

import { AddIcon, CheckIcon, RemoveIcon } from "../Imports/Icons.js";
import { capitalized } from "./Entity.js";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import { useTableRowItem } from "../ContextProviders/TableRowProvider.js";
import { useAssociationType, useRelevantPrimaryItems } from "../ContextProviders/AssociationManagementPageProvider.js";
import { Button, Typography } from "@mui/material";
import { useSnackbar } from "../ContextProviders/AppFeatures.js";
import { User } from "./Entities/User.js";

class Association {
    static url = null;
    static primary = null;
    static secondary = null;

    static singular = "association";
    static plural = "associations";

    static assignPresent = "assign";
    static assignPast = "assigned";
    static unassignPresent = "unassign";
    static unassignPast = "unassigned";

    static AssignIcon = AddIcon;
    static UnassignIcon = RemoveIcon;

    static secondaryFieldInPrimary = null;

    static handleAssign ([...primaries], [...secondaries]) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.url}`, {
                action: "assign",
                [this.primary.plural]: primaries,
                [this.secondary.plural]: secondaries
            }).then(() => {
                resolve(`${capitalized(primaries.length > 1 || secondaries.length > 1 ? this.plural : this.singular)} updated`);
            }).catch(() => {
                reject(new Error(`Failed to update ${this.plural.toLowerCase()}`));
            });
        });
    }

    static handleUnassign ([...primaries], [...secondaries]) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.url}`, {
                action: "unassign",
                [this.primary.plural]: primaries,
                [this.secondary.plural]: secondaries
            }).then(() => {
                resolve(`${capitalized(primaries.length > 1 || secondaries.length > 1 ? this.plural : this.singular)} updated`);
            }).catch(() => {
                reject(new Error(`Failed to update ${this.plural.toLowerCase()}`));
            });
        });
    }

    static TableCells = {
        AssignButton () {
            const showSnackbar = useSnackbar();
            const secondaryItem = useTableRowItem();
            const primaryItems = useRelevantPrimaryItems();
            const AssociationType = useAssociationType();
            const buttonColor = AssociationType.secondary === User && secondaryItem.is_admin_or_collection_manager ? "secondary" : "primary";
            const quantity = secondaryItem.quantity_assigned;
            if (quantity === primaryItems.length) {
                const buttonText = (
                    primaryItems.length === 1
                        ? `${AssociationType.assignPast} ${AssociationType.primary.singular}`
                        : `${AssociationType.assignPast} ${quantity} ${AssociationType.primary.plural}`
                );
                return (
                    <Button variant="text" color={buttonColor} disabled startIcon={<CheckIcon />}>
                        <Typography variant="body1">{buttonText}</Typography>
                    </Button>
                );
            } else if (quantity < primaryItems.length) {
                const buttonText = (
                    primaryItems.length === 1
                        ? `${AssociationType.assignPresent} ${AssociationType.primary.singular}`
                        : quantity > 0
                            ? `${AssociationType.assignPresent} ${primaryItems.length - quantity} more ${primaryItems.length - quantity !== 1 ? AssociationType.primary.plural : AssociationType.primary.singular}`
                            : `${AssociationType.assignPresent} ${primaryItems.length - quantity} ${primaryItems.length - quantity !== 1 ? AssociationType.primary.plural : AssociationType.primary.singular}`
                );
                return (
                    <Button variant="outlined" color={buttonColor} startIcon={<AssociationType.AssignIcon />} onClick={() => {
                        const primaryIds = primaryItems.map((p) => p.id);
                        AssociationType.handleAssign(primaryIds, [secondaryItem.id]).then((msg) => {
                            showSnackbar(msg, "success");
                            // refreshAllItems();
                        }).catch((err) => {
                            showSnackbar(err.message, "error");
                        });
                    }}>
                        <Typography variant="body1">
                            {buttonText}
                        </Typography>
                    </Button>
                );
            }
            return "Error";
        },
        UnassignButton () {
            const showSnackbar = useSnackbar();
            const secondaryItem = useTableRowItem();
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
                <Button variant="outlined" color={buttonColor} startIcon={<AssociationType.UnassignIcon />} onClick={() => {
                    const primaryIds = primaryItems.map((p) => p.id);
                    AssociationType.handleUnassign(primaryIds, [secondaryItem.id]).then((msg) => {
                        showSnackbar(msg, "success");
                        // refreshAllItems();
                    }).catch((err) => {
                        showSnackbar(err.message, "error");
                    });
                }}>
                    <Typography variant="body1">{buttonText}</Typography>
                </Button>
            );
        }
    };

    static tableFields = [];
}

export { Association };
