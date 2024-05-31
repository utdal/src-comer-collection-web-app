import { User } from "../Classes/Entities/User.js";
import { Course } from "../Classes/Entities/Course.ts";
import { DeletedImage, Image } from "../Classes/Entities/Image.js";
import { Artist } from "../Classes/Entities/Artist.ts";
import { Tag } from "../Classes/Entities/Tag.js";
import { Exhibition } from "../Classes/Entities/Exhibition.ts";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import { capitalized } from "../Classes/Entity.ts";

/**
 * @type {{
 *  [I in Intent]: Function[]
 * }}
 */
const permittedEntitiesByIntent = {
    "single-delete": [User, Course, Image, Artist, Tag, Exhibition],
    "single-permanent-delete": [DeletedImage],
    "single-restore": [DeletedImage],
    "single-edit": [User, Course, Image, Artist, Tag],
    "multi-create": [User, Course, Image],
    "user-reset-password": [User],
    "user-change-activation-status": [User]
};

/**
 * @type {{
 *  [I in Intent]: import("react-router-dom").V7_FormMethod
 * }}
 */
const requiredMethodsByIntent = {
    "single-delete": "DELETE",
    "single-permanent-delete": "DELETE",
    "single-restore": "PUT",
    "single-edit": "PUT",
    "multi-create": "POST",
    "user-reset-password": "PUT",
    "user-change-activation-status": "PUT"
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

const buildRouterActionByEntity = (entityType) => {
    /**
     * @param {{request: {
     *  method: import("react-router-dom").V7_FormMethod,
     *  json: () => RouterActionRequest
     * }, params: import("react-router").Params}}
     * @returns {RouterActionResponse}
     */
    const routerAction = async ({ request, params }) => {
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
                const result = await sendAuthenticatedRequest("DELETE", `${entityType.baseUrl}/${itemId}`);
                return {
                    status: "success",
                    message: result,
                    snackbarText: `${capitalized(entityType.singular)} ${entityType.hasTrash ? "moved to trash" : "deleted"}`
                };
            } catch (e) {
                return {
                    status: "error",
                    error: e.message,
                    snackbarText: entityType.hasTrash ? `Could not delete ${entityType.singular}` : `Could not move ${entityType.singular} to trash`
                };
            }
        } else if (intent === "single-permanent-delete") {
            const { itemId } = requestData;
            try {
                const result = await sendAuthenticatedRequest("DELETE", `${entityType.baseUrl}/${itemId}`);
                return {
                    status: "success",
                    message: result,
                    snackbarText: `${capitalized(entityType.singular)} permanently deleted`
                };
            } catch (e) {
                return {
                    status: "error",
                    error: e.message,
                    snackbarText: `Could not permanently delete ${entityType.singular}`
                };
            }
        } else if (intent === "single-restore") {
            const { itemId } = requestData;
            try {
                const result = await sendAuthenticatedRequest("PUT", `${entityType.baseUrl}/${itemId}`);
                return {
                    status: "success",
                    message: result,
                    snackbarText: `${capitalized(entityType.singular)} restored`
                };
            } catch (e) {
                return {
                    status: "error",
                    error: e.message,
                    snackbarText: `Could not restore ${entityType.singular}`
                };
            }
        } else if (intent === "single-edit") {
            const { body, itemId } = requestData;
            try {
                const result = await sendAuthenticatedRequest("PUT", `${entityType.baseUrl}/${itemId}`, body);
                return {
                    status: "success",
                    message: result,
                    snackbarText: `${capitalized(entityType.singular)} updated`
                };
            } catch (e) {
                return {
                    status: "error",
                    error: e.message,
                    snackbarText: `Could not edit ${entityType.singular}`
                };
            }
        } else if (intent === "multi-create") {
            const { body } = requestData;
            try {
                const promiseResults = await Promise.allSettled(body.itemsToCreate.map((newItem) => {
                    return new Promise((resolve, reject) => {
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
                        message: "all items created",
                        snackbarText: body.itemsToCreate.length > 1
                            ? `Created ${body.itemsToCreate.length} ${entityType.plural}`
                            : `Created ${entityType.singular}`
                    };
                case body.itemsToCreate.length:
                    return {
                        status: "error",
                        error: "no items created",
                        snackbarText: body.itemsToCreate.length > 1
                            ? `Could not create ${indicesWithErrors.length} ${entityType.plural}`
                            : `Could not create ${entityType.singular}`
                    };
                default:
                    return {
                        status: "partial",
                        indicesWithErrors,
                        errors: promiseResults.map((promiseResult) => promiseResult.reason),
                        snackbarText: `Created ${body.itemsToCreate.length - indicesWithErrors.length} of ${body.itemsToCreate.length} ${entityType.plural}`
                    };
                };
            } catch (e) {
                return {
                    status: "error",
                    error: e.message,
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
                    message: "Reset user password",
                    snackbarText: "User password reset"
                };
            } catch (e) {
                return {
                    status: "error",
                    error: e.message,
                    snackbarText: "Could not reset user password"
                };
            }
        } else {
            throw new Response("Method not allowed", { status: 405 });
        }
    };
    return routerAction;
};

export default buildRouterActionByEntity;
