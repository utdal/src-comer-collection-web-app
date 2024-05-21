/* eslint-disable react/prop-types */
import { IconButton } from "@mui/material";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import { DeleteIcon, EditIcon } from "../Imports/Icons.js";
import React, { useCallback } from "react";
import { useTableRowItem } from "../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../ContextProviders/ManagementPageProvider.js";

export const capitalized = (string) => {
    return string.substr(0, 1).toUpperCase() + string.substr(1).toLowerCase();
};

class Entity {
    static baseUrl = null;

    static singular = "item";
    static plural = "items";

    static fieldDefinitions = [
        {
            fieldName: "id",
            displayName: "ID"
        }
    ];

    static searchBoxFields = [];

    static formatDate = (date) => {
        return new Date(date).toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short"
        });
    };

    static formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    static TableCells = {
        EditButton ({ onClick, disabled }) {
            return (
                <IconButton {...{ onClick, disabled }}>
                    <EditIcon />
                </IconButton>
            );
        },
        DeleteButton ({ onClick, disabled }) {
            return (
                <IconButton {...{ onClick, disabled }}>
                    <DeleteIcon />
                </IconButton>
            );
        },
        EntityManageEditButton ({ disabled }) {
            const item = useTableRowItem();
            const { handleOpenEntityEditDialog } = useManagementCallbacks();
            const handleOpenEditDialog = useCallback(() => {
                handleOpenEntityEditDialog(item);
            }, [handleOpenEntityEditDialog, item]);
            return (
                <Entity.TableCells.EditButton
                    {...{ disabled }}
                    onClick={handleOpenEditDialog} />
            );
        },
        EntityManageDeleteButton ({ disabled }) {
            const item = useTableRowItem();
            const { handleOpenEntityDeleteDialog } = useManagementCallbacks();
            const handleOpenDeleteDialog = useCallback(() => {
                handleOpenEntityDeleteDialog(item);
            }, [handleOpenEntityDeleteDialog, item]);
            return (
                <Entity.TableCells.DeleteButton
                    {...{ disabled }}
                    onClick={handleOpenDeleteDialog} />
            );
        }
    };

    static handleMultiCreate ([...newItems]) {
        return Promise.allSettled(newItems.map((newItem) => {
            return new Promise((resolve, reject) => {
                sendAuthenticatedRequest("POST", `${this.baseUrl}`, newItem).then(() => {
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
            });
        }));
    }

    static handleDelete (itemId) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("DELETE", `${this.baseUrl}/${itemId}`).then(() => {
                resolve(`${capitalized(this.singular)} deleted`);
            }).catch(() => {
                reject(new Error(`Failed to delete ${this.singular.toLowerCase()}`));
            });
        });
    }

    static handleEdit (itemId, updateFields) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${itemId}`, updateFields).then(() => {
                resolve(`${capitalized(this.singular)} updated`);
            }).catch(() => {
                reject(new Error(`Failed to update ${this.singular.toLowerCase()}`));
            });
        });
    }

    static tableFields = [];
}

export { Entity };
