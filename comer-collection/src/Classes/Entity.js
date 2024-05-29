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

    /**
     * @type {React.ElementType}
     */
    static DefaultIcon = null;

    static searchBoxFields = ["id"];
    static searchBoxPlaceholder = "Search items by ID";

    static MultiCreateButtonIcon = AddIcon;
    static multiCreateDialogSubtitle = null;

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

export const itemsCombinedStatePropTypeShape = PropTypes.shape({
    items: PropTypes.arrayOf(entityPropTypeShape),
    selectedItems: PropTypes.arrayOf(entityPropTypeShape),
    visibleItems: PropTypes.arrayOf(entityPropTypeShape),
    selectedVisibleItems: PropTypes.arrayOf(entityPropTypeShape),
    filterFunction: PropTypes.func
});

export const tableFieldPropTypeShape = PropTypes.shape({
    columnDescription: PropTypes.string,
    TableCellComponent: PropTypes.elementType
});

/**
 * This higher-order function returns a function that can be used
 * as an action in React Router
 * @param {*} entityType
 * @returns {({request, params}) => {
 *  status: "success",
 *  message: string
 * }|{
 *  status: "error",
 *  error: string
 * }}
 */
export const buildRouterAction = (entityType) => {
    return async ({ request, params }) => {
        const { id } = await request.json();
        if (request.method === "DELETE") {
            try {
                const result = await entityType.handleDelete(id);
                return {
                    status: "success",
                    message: result
                };
            } catch (e) {
                return {
                    status: "error",
                    error: e.message
                };
            }
        } else {
            throw new Response(null, { status: 405 });
        }
    };
};
