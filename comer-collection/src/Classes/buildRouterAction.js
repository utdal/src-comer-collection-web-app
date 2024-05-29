import { User } from "./Entities/User.js";
import { Course } from "./Entities/Course.js";
import { Image } from "./Entities/Image.js";
import { Artist } from "./Entities/Artist.js";
import { Tag } from "./Entities/Tag.js";
import { Exhibition } from "./Entities/Exhibition.js";
import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";
import { capitalized } from "./Entity.js";

/**
 * @typedef {{
 *  intent: ("single-delete"),
 *  itemId: number
 * }|{
 *  intent: ("multi-delete"),
 *  itemIds: number[]
 * }|{
 *  intent: ("single-edit"),
 *  itemId: number,
 *  body: Object<string, any>
 * }|{
 *  intent: ("user-reset-password"),
 *  userId: number,
 *  body: Object<string, any>
 * }|{
 *  intent: ("multi-create"),
 *  itemId: number,
 *  body: Object<string, any>
 * }} RouterActionRequest
 */

/**
 * @typedef {{
 *  status: "success",
 *  message: string,
 *  snackbarText: string
 * }|{
 *  status: "error",
 *  error: string,
 *  snackbarText: string
 * }} RouterActionResponse
 */

/**
 * @typedef {(User|Course)} EntityType
 */

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

const buildRouterAction = (entityType) => {
    /**
     * @param {{request: {
     *  method: import("react-router-dom").V7_FormMethod,
     *  json: () => RouterActionRequest
     * }, params: Object<string, string>}}
     * @returns {RouterActionResponse}
     */
    const routerAction = async ({ request, params }) => {
        const requestData = await request.json();
        const { intent } = requestData;
        if (request.method === "DELETE" && intent === "single-delete" && [User, Course, Image, Artist, Tag, Exhibition].includes(entityType)) {
            const { itemId } = requestData;
            try {
                const result = await sendAuthenticatedRequest("DELETE", `${entityType.baseUrl}/${itemId}`);
                return {
                    status: "success",
                    message: result,
                    snackbarText: `${capitalized(entityType.singular)} deleted`
                };
            } catch (e) {
                return {
                    status: "error",
                    error: e.message,
                    snackbarText: `Could not delete ${entityType.singular}`
                };
            }
        } else if (request.method === "PUT" && intent === "single-edit" && [User, Course, Image, Artist, Tag].includes(entityType)) {
            const { itemId } = requestData;
            try {
                const result = await sendAuthenticatedRequest("PUT", `${entityType.baseUrl}/${itemId}`, requestData.body);
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
        } else {
            throw new Response("Method not allowed", { status: 405 });
        }
    };
    return routerAction;
};

export default buildRouterAction;
