import { AddIcon, RemoveIcon } from "../Imports/Icons.js";
import { Entity, capitalized } from "./Entity";
import { sendAuthenticatedRequest } from "../Helpers/APICalls";
import type React from "react";
import type { TableFieldDefinition } from "../index.js";

class Association extends null {
    public static url = "/";

    public static primary = Entity;

    public static secondary = Entity;

    public static singular = "association";

    public static plural = "associations";

    public static assignPresent = "assign";

    public static assignPast = "assigned";

    public static unassignPresent = "unassign";

    public static unassignPast = "unassigned";

    public static AssignIcon = AddIcon as React.FunctionComponent;

    public static UnassignIcon = RemoveIcon as React.FunctionComponent;

    public static secondaryFieldInPrimary = "";

    public static secondarySearchBoxFields = ["id"];

    public static secondarySearchBoxPlaceholder = "Search secondary items by ID";

    public static tableFields = [] as TableFieldDefinition[];

    public static async handleAssign ([...primaries]: readonly number[], [...secondaries]: readonly number[]): Promise<string> {
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

    public static async handleUnassign ([...primaries]: readonly number[], [...secondaries]: readonly number[]): Promise<string> {
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
