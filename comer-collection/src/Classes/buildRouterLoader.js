import { sendAuthenticatedRequest } from "../Helpers/APICalls.js";

const buildRouterLoader = (entityType) => {
    const routerLoader = () => {
        return new Promise((resolve, reject) => {
            sendAuthenticatedRequest("GET", `${entityType.baseUrl}`).then((response) => {
                resolve(response.data);
            }).catch((e) => {
                reject(e);
            });
        });
    };
    return routerLoader;
};

export default buildRouterLoader;
