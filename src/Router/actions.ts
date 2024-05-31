import type { ActionFunction, ActionFunctionArgs } from "react-router";
import { Exhibition } from "../Classes/Entities/Exhibition";
import type { RouterActionRequest, RouterActionResponse } from "../index.js";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const myExhibitionsAction: ActionFunction = async ({ request }: ActionFunctionArgs): Promise<RouterActionResponse> => {
    const requestData = await request.json() as RouterActionRequest;
    if (request.method === "POST") {
        try {
            await Exhibition.handleMultiCreate([requestData]);
            return {
                status: "success",
                snackbarText: "Exhibition created"
            };
        } catch (e) {
            return {
                status: "error",
                snackbarText: "Could not create exhibition"
            };
        }
    } else if (request.method === "PUT") {
        const { id, ...requestBody } = requestData;
        try {
            await Exhibition.handleEdit(id, requestBody);
            return {
                status: "success",
                snackbarText: "Exhibition settings updated"
            };
        } catch (e) {
            return {
                status: "error",
                snackbarText: "Could not update exhibition"
            };
        }
    } else {
        throw new Error("Method not allowed");
    }
};
