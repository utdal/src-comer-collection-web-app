import { sendAuthenticatedRequest } from "../Helpers/APICalls";
import { Image } from "../Classes/Entities/Image";
import type { LoaderFunction, Params } from "react-router";

export const appUserLoader: LoaderFunction = async () => {
    if (localStorage.getItem("token") == null) {
        return false;
    }
    const response = await sendAuthenticatedRequest("GET", "/api/account/profile");
    if (response.status === 200) {
        console.log(response.data);
        return response.data;
    } else {
        throw new Response("Network request failed", { status: 405 });
    }
};

export const exhibitionPageLoader: LoaderFunction = async ({ params }: {
    readonly params: Params;
}) => {
    const exhibitionId = parseInt((params as { exhibitionId: string }).exhibitionId);
    const exhibitionUrl = `/api/exhibitions/${exhibitionId}/data`;
    try {
        const [{ data: exhibitionData }, { data: globalImageCatalog }] = await Promise.all([
            sendAuthenticatedRequest("GET", exhibitionUrl),
            sendAuthenticatedRequest("GET", Image.baseUrl)
        ]);
        return { exhibitionData, globalImageCatalog };
    } catch (e) {
        throw new Error("Exhibition Unavailable");
    }
};
