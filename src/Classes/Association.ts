import { AddIcon, RemoveIcon } from "../Imports/Icons.js";
import { Entity, capitalized } from "./Entity.js";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";

class Association {
    public static url = "/";

    public static primary = Entity;

    public static secondary = Entity;

    public static singular = "association";

    public static plural = "associations";

    public static assignPresent = "assign";

    public static assignPast = "assigned";

    public static unassignPresent = "unassign";

    public static unassignPast = "unassigned";

    public static AssignIcon = AddIcon;

    public static UnassignIcon = RemoveIcon;

    public static secondaryFieldInPrimary = null;

    public static secondarySearchBoxFields = ["id"];

    public static secondarySearchBoxPlaceholder = "Search secondary items by ID";

    /**
     * @type {TableFieldDefinition[]}
     */
    public static tableFields = [];

    public static async handleAssign ([...primaries]: number[], [...secondaries]: number[]): Promise<void> {
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

    public static async handleUnassign ([...primaries]: number, [...secondaries]: number) {
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
}

export { Association };
