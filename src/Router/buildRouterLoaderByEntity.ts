import { sendAuthenticatedRequest } from "../Helpers/APICalls.ts";

const buildRouterLoaderByEntity = (entityType) => {
    const routerLoader = async (): Promise<object> => {
        const response = await sendAuthenticatedRequest("GET", `${entityType.baseUrl}`);
        return response.data;
    };
    return routerLoader;
};

export default buildRouterLoaderByEntity;
