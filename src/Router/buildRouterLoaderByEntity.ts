import type { LoaderFunction } from "react-router";
import { sendAuthenticatedRequest } from "../Helpers/APICalls";
import type { EntityType } from "../index.js";

const buildRouterLoaderByEntity = (entityType: EntityType): LoaderFunction => {
    const routerLoader = async (): Promise<object> => {
        const response = await sendAuthenticatedRequest("GET", `${entityType.baseUrl}`);
        if (response.data) {
            return response.data;
        }
        throw new Error("Router loader received no response data");
    };
    return routerLoader;
};

export default buildRouterLoaderByEntity;
