import { User } from "../Classes/Entities/User";
import { Course } from "../Classes/Entities/Course";
import { DeletedImage, Image } from "../Classes/Entities/Image";
import { Artist } from "../Classes/Entities/Artist";
import { Tag } from "../Classes/Entities/Tag";
import { Exhibition } from "../Classes/Entities/Exhibition";
import { sendAuthenticatedRequest } from "../Helpers/APICalls";
import { capitalized } from "../Classes/Entity";
import type { EntityType, Intent, RouterActionRequest, RouterActionResponse } from "../index.js";
import type { ActionFunction, ActionFunctionArgs, V7_FormMethod as FormMethod } from "react-router-dom";

const permittedEntitiesByIntent: Record<Intent, EntityType[]> = {
    "single-delete": [User, Course, Image, Artist, Tag, Exhibition],
    "single-permanent-delete": [DeletedImage],
    "single-restore": [DeletedImage],
    "single-edit": [User, Course, Image, Artist, Tag],
    "multi-create": [User, Course, Image],
    "user-reset-password": [User],
    "user-change-activation-status": [User],
    "multi-delete": [User, Course, Image, Artist, Tag, Exhibition],
    "user-change-privileges": [User]
};

const requiredMethodsByIntent: Record<Intent, FormMethod> = {
    "single-delete": "DELETE",
    "single-permanent-delete": "DELETE",
    "single-restore": "PUT",
    "single-edit": "PUT",
    "multi-create": "POST",
    "user-reset-password": "PUT",
    "user-change-activation-status": "PUT",
    "multi-delete": "DELETE",
    "user-change-privileges": "PUT"
};

/**
 * This higher-order function returns a function that can be used
 * as an action in React Router
 * @param {{
 *  singular: string,
 *  plural: string,
 *  baseUrl: string
 * }} entityType
 * @returns {({request, params}) => RouterActionResponse}
 */

interface RouterRequest extends Request {
    json: () => Promise<RouterActionRequest>;
}

interface RouterActionFunctionArgs extends ActionFunctionArgs {
    request: RouterRequest;
}

const buildRouterActionByEntity = (entityType: EntityType): ActionFunction => {
    const routerAction: ActionFunction = async ({ request }: RouterActionFunctionArgs): Promise<RouterActionResponse> => {
        const requestData = await request.json();
        const { intent } = requestData;

        if (!permittedEntitiesByIntent[intent].includes(entityType)) {
            throw new Error(`The intent '${intent}' is not permitted on the entity '${entityType.singular}'`);
        } else if (requiredMethodsByIntent[intent] !== request.method) {
            throw new Error(`The intent '${intent}' requires the ${requiredMethodsByIntent[intent]} method, but the route received a ${request.method} request`);
        }

        if (intent === "single-delete") {
            const { itemId } = requestData;
            try {
                await sendAuthenticatedRequest("DELETE", `${entityType.baseUrl}/${itemId}`);
                return {
                    status: "success",
                    snackbarText: `${capitalized(entityType.singular)} ${entityType.hasTrash ? "moved to trash" : "deleted"}`
                };
            } catch (e) {
                return {
                    status: "error",
                    snackbarText: entityType.hasTrash ? `Could not delete ${entityType.singular}` : `Could not move ${entityType.singular} to trash`
                };
            }
        } else if (intent === "single-permanent-delete") {
            const { itemId } = requestData;
            try {
                await sendAuthenticatedRequest("DELETE", `${entityType.baseUrl}/${itemId}`);
                return {
                    status: "success",
                    snackbarText: `${capitalized(entityType.singular)} permanently deleted`
                };
            } catch (e) {
                return {
                    status: "error",
                    snackbarText: `Could not permanently delete ${entityType.singular}`
                };
            }
        } else if (intent === "single-restore") {
            const { itemId } = requestData;
            try {
                await sendAuthenticatedRequest("PUT", `${entityType.baseUrl}/${itemId}`);
                return {
                    status: "success",
                    snackbarText: `${capitalized(entityType.singular)} restored`
                };
            } catch (e) {
                return {
                    status: "error",
                    snackbarText: `Could not restore ${entityType.singular}`
                };
            }
        } else if (intent === "single-edit") {
            const { body, itemId } = requestData;
            try {
                await sendAuthenticatedRequest("PUT", `${entityType.baseUrl}/${itemId}`, body);
                return {
                    status: "success",
                    snackbarText: `${capitalized(entityType.singular)} updated`
                };
            } catch (e) {
                return {
                    status: "error",
                    snackbarText: `Could not edit ${entityType.singular}`
                };
            }
        } else if (intent === "multi-create") {
            const { body } = requestData;
            try {
                const promiseResults = await Promise.allSettled(body.itemsToCreate.map(async (newItem) => {
                    return new Promise<void>((resolve, reject) => {
                        sendAuthenticatedRequest("POST", `${entityType.baseUrl}`, newItem).then(() => {
                            resolve();
                        }).catch((e) => {
                            reject(e);
                        });
                    });
                }));
                console.log(promiseResults);
                const indicesWithErrors = promiseResults
                    .map((promiseResult, index) => ({ index, promiseResult }))
                    .filter(({ promiseResult }) => promiseResult.status === "rejected")
                    .map(({ index }) => index);

                switch (indicesWithErrors.length) {
                case 0:
                    return {
                        status: "success",
                        snackbarText: body.itemsToCreate.length > 1
                            ? `Created ${body.itemsToCreate.length} ${entityType.plural}`
                            : `Created ${entityType.singular}`
                    };
                case body.itemsToCreate.length:
                    return {
                        status: "error",
                        snackbarText: body.itemsToCreate.length > 1
                            ? `Could not create ${indicesWithErrors.length} ${entityType.plural}`
                            : `Could not create ${entityType.singular}`
                    };
                default:
                    return {
                        status: "partial",
                        indicesWithErrors,
                        errors: promiseResults.map((promiseResult) => (promiseResult as PromiseRejectedResult).reason as string),
                        snackbarText: `Created ${body.itemsToCreate.length - indicesWithErrors.length} of ${body.itemsToCreate.length} ${entityType.plural}`
                    };
                }
            } catch (e) {
                return {
                    status: "error",
                    snackbarText: `Could not create ${entityType.plural}`
                };
            }
        } else if (intent === "user-reset-password") {
            const { body, userId } = requestData;
            try {
                const { newPassword } = body;
                await sendAuthenticatedRequest("PUT", `${entityType.baseUrl}/${userId}/password`, { newPassword });
                return {
                    status: "success",
                    snackbarText: "User password reset"
                };
            } catch (e) {
                return {
                    status: "error",
                    snackbarText: "Could not reset user password"
                };
            }
        } else {
            throw new Error("Method not allowed");
        }
    };
    return routerAction;
};

export default buildRouterActionByEntity;
