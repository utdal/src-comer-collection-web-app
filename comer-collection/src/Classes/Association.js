import { AddIcon, RemoveIcon } from "../Imports/Icons.js";
import { capitalized } from "./Entity.js";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";

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

    static secondarySearchBoxFields = ["id"];
    static secondarySearchBoxPlaceholder = "Search secondary items by ID";

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

    static tableFields = [];
}

export { Association };
