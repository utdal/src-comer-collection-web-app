import type { LoaderFunction } from "react-router";
import { sendAuthenticatedRequest } from "../Helpers/APICalls";
import type { EntityType } from "../index.js";

const buildRouterLoaderByEntity = (entityType: EntityType): LoaderFunction => {
    const routerLoader = async (): Promise<object> => {
        const response = await sendAuthenticatedRequest("GET", `${entityType.baseUrl}`);
        return response.data;
    };
    return routerLoader;
};

export default buildRouterLoaderByEntity;
