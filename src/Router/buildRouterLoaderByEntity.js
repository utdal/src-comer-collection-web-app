import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";

const buildRouterLoaderByEntity = (entityType) => {
    const routerLoader = async () => {
        const response = await sendAuthenticatedRequest("GET", `${entityType.baseUrl}`);
        return response.data;
    };
    return routerLoader;
};

export default buildRouterLoaderByEntity;
