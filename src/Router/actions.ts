import type { ActionFunction, ActionFunctionArgs } from "react-router";
import { Exhibition } from "../Classes/Entities/Exhibition.js";
import type { RouterActionRequest, RouterActionResponse } from "../index.js";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const myExhibitionsAction: ActionFunction = async ({ request }: ActionFunctionArgs): Promise<RouterActionResponse> => {
    const requestData = await request.json() as RouterActionRequest;
    if (request.method === "POST") {
        try {
            await Exhibition.handleMultiCreate([requestData]);
            return {
                status: "success",
                message: "Exhibition created",
                snackbarText: "Exhibition created"
            };
        } catch (e) {
            return {
                status: "error",
                error: (e as Error).message,
                snackbarText: "Could not create exhibition"
            };
        }
    } else if (request.method === "PUT") {
        const { id, ...requestBody } = requestData;
        try {
            const result = await Exhibition.handleEdit(id, requestBody);
            return {
                status: "success",
                message: result as string,
                snackbarText: "Exhibition settings updated"
            };
        } catch (e) {
            return {
                status: "error",
                error: (e as Error).message,
                snackbarText: "Could not update exhibition"
            };
        }
    } else {
        throw new Error("Method not allowed");
    }
};
