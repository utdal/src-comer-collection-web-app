import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import PropTypes from "prop-types";
import { AddIcon } from "../Imports/Icons.js";

export const capitalized = (string) => {
    return string.substr(0, 1).toUpperCase() + string.substr(1).toLowerCase();
};

export class Entity {
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

    static MultiCreateButtonIcon = AddIcon;

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

    /**
     * @returns {Promise<Object[]>} The requested data
     */
    static handleFetchAll () {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("GET", `${this.baseUrl}`).then((response) => {
                resolve(response.data);
            }).catch((e) => {
                reject(e);
            });
        });
    }

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

export const entityPropTypeShape = PropTypes.shape({
    id: PropTypes.number
});

export const itemsCombinedStatePropTypeShape = {
    items: PropTypes.arrayOf(entityPropTypeShape),
    selectedItems: PropTypes.arrayOf(entityPropTypeShape),
    visibleItems: PropTypes.arrayOf(entityPropTypeShape),
    selectedVisibleItems: PropTypes.arrayOf(entityPropTypeShape),
    filterFunction: PropTypes.func
};

export const tableFieldPropTypeShape = {
    columnDescription: PropTypes.string,
    TableCellComponent: PropTypes.elementType
};
