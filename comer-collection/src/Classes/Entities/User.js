/* eslint-disable react/prop-types */
import { sendAuthenticatedRequest } from "../../Helpers/APICalls.js";
import { Entity } from "../Entity.js";
import { UserIDCell } from "../../Components/TableCells/User/UserIDCell.js";
import { UserFullNameReverseCell } from "../../Components/TableCells/User/UserFullNameReverseCell.js";
import { UserEmailCopyCell } from "../../Components/TableCells/User/UserEmailCopyCell.js";
import { UserPasswordSetOrResetCell } from "../../Components/TableCells/User/UserPasswordSetOrResetCell.js";
import { UserCourseAssignmentCell } from "../../Components/TableCells/User/UserCourseAssignmentCell.js";
import { UserExhibitionCountCell } from "../../Components/TableCells/User/UserExhibitionCountCell.js";
import { UserTypeButtonCell } from "../../Components/TableCells/User/UserTypeButtonCell.js";
import { UserActivationSwitchCell } from "../../Components/TableCells/User/UserActivationSwitchCell.js";
import { UserOptionsCell } from "../../Components/TableCells/User/UserOptionsCell.js";
import { GroupAddIcon, PersonIcon } from "../../Imports/Icons.js";

class User extends Entity {
    static baseUrl = "/api/admin/users";
    static singular = "user";
    static plural = "users";

    static DefaultIcon = PersonIcon;

    static MultiCreateButtonIcon = GroupAddIcon;
    static multiCreateDialogSubtitle = "You can set passwords, roles, and course enrollments after creating the users.";

    static fieldDefinitions = [
        {
            fieldName: "given_name",
            displayName: "First Name"
        },
        {
            fieldName: "family_name",
            displayName: "Last Name"
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

    static handleChangeUserAccess (userId, newAccess) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${userId}/access`, { access_level: newAccess }).then(() => {
                resolve("User access updated");
            }).catch(() => {
                reject(new Error("Failed to update user access"));
            });
        });
    }

    static handleChangeUserActivationStatus (userId, newActivationStatus) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${userId}/${newActivationStatus ? "activate" : "deactivate"}`).then(() => {
                resolve(newActivationStatus ? "User activated" : "User deactivated");
            }).catch(() => {
                reject(new Error(newActivationStatus ? "Failed to activate user" : "Failed to deactivate user"));
            });
        });
    }

    static handleResetPassword (userId, newPassword) {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("PUT", `${this.baseUrl}/${userId}/password`, { newPassword }).then(() => {
                resolve("Password reset");
            }).catch(() => {
                reject(new Error("Failed to reset password"));
            });
        });
    }

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: UserIDCell,
            generateSortableValue: (user) => user.id
        },
        {
            columnDescription: "Name",
            maxWidth: "150px",
            TableCellComponent: UserFullNameReverseCell,
            generateSortableValue: (user) => user.full_name_reverse.toLowerCase()
        },
        {
            columnDescription: "Email",
            TableCellComponent: UserEmailCopyCell,
            generateSortableValue: (user) => user.email
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
}

export { User };
