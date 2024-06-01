/* eslint-disable react/prop-types */
import { sendAuthenticatedRequest } from "../../Helpers/APICalls";
import { Entity } from "../Entity";
import UserIDCell from "../../Components/TableCells/User/UserIDCell";
import UserFullNameReverseCell from "../../Components/TableCells/User/UserFullNameReverseCell";
import UserEmailCopyCell from "../../Components/TableCells/User/UserEmailCopyCell";
import UserPasswordSetOrResetCell from "../../Components/TableCells/User/UserPasswordSetOrResetCell";
import UserCourseAssignmentCell from "../../Components/TableCells/User/UserCourseAssignmentCell";
import UserExhibitionCountCell from "../../Components/TableCells/User/UserExhibitionCountCell";
import UserTypeButtonCell from "../../Components/TableCells/User/UserTypeButtonCell";
import UserActivationSwitchCell from "../../Components/TableCells/User/UserActivationSwitchCell";
import UserOptionsCell from "../../Components/TableCells/User/UserOptionsCell";
import { GroupAddIcon, PersonIcon } from "../../Imports/Icons";
import type React from "react";
import type { EntityFieldDefinition, Item, SortableValue, TableFieldDefinition } from "../../index.js";

class User extends Entity {
    public static baseUrl = "/api/users";

    public static singular = "user";

    public static plural = "users";

    public static DefaultIcon = PersonIcon as React.FunctionComponent;

    public static MultiCreateButtonIcon = GroupAddIcon as React.FunctionComponent;

    public static multiCreateDialogSubtitle = "You can set passwords, roles, and course enrollments after creating the users.";

    public static searchBoxFields = ["full_name", "full_name_reverse", "email_without_domain"];

    public static searchBoxPlaceholder = "Search by user name or email";

    public static fieldDefinitions: EntityFieldDefinition[] = [
        {
            fieldName: "given_name",
            displayName: "First Name",
            isRequired: false
        },
        {
            fieldName: "family_name",
            displayName: "Last Name",
            isRequired: false
        },
        {
            fieldName: "email",
            displayName: "Email",
            isRequired: true,
            inputType: "email"
        },
        {
            fieldName: "exhibition_quota",
            displayName: "Exhibition Quota",
            isRequired: true,
            inputType: "number",
            blank: 5,
            minValue: 0
        }
    ];

    public static tableFields: TableFieldDefinition[] = [
        {
            columnDescription: "ID",
            TableCellComponent: UserIDCell,
            generateSortableValue: (user: Item): SortableValue => user.id
        },
        {
            columnDescription: "Name",
            maxWidth: "150px",
            TableCellComponent: UserFullNameReverseCell,
            generateSortableValue: (user: Item): SortableValue => (user.full_name_reverse as string).toLowerCase()
        },
        {
            columnDescription: "Email",
            TableCellComponent: UserEmailCopyCell,
            generateSortableValue: (user: Item): SortableValue => user.email as string
        },
        {
            columnDescription: "Password",
            TableCellComponent: UserPasswordSetOrResetCell
        },
        {
            columnDescription: "Courses",
            TableCellComponent: UserCourseAssignmentCell
        },
        {
            columnDescription: "Exhibitions",
            TableCellComponent: UserExhibitionCountCell
        },
        {
            columnDescription: "User Type",
            TableCellComponent: UserTypeButtonCell
        },
        {
            columnDescription: "Active",
            TableCellComponent: UserActivationSwitchCell
        },
        {
            columnDescription: "Options",
            TableCellComponent: UserOptionsCell
        }
    ];

    public static async handleChangeUserAccess (userId: number, newAccess: string): Promise<string> {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${userId}/access`, { access_level: newAccess }).then(() => {
                resolve("User access updated");
            }).catch(() => {
                reject(new Error("Failed to update user access"));
            });
        });
    }

    public static async handleChangeUserActivationStatus (userId: number, newActivationStatus: boolean): Promise<string> {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${userId}/${newActivationStatus ? "activate" : "deactivate"}`).then(() => {
                resolve(newActivationStatus ? "User activated" : "User deactivated");
            }).catch(() => {
                reject(new Error(newActivationStatus ? "Failed to activate user" : "Failed to deactivate user"));
            });
        });
    }
}

export { User };
