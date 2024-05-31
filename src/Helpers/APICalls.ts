import axios from "axios";

const apiLocation: string = process.env.REACT_APP_API_HOST ?? "";

type AxiosMethod = "DELETE" | "GET" | "POST" | "PUT";

interface APIResponse {
    data: object;
    status: number;
}

export const sendAuthenticatedRequest = async (method: AxiosMethod, url: string, payload: object): Promise<APIResponse> => {
    const token = localStorage.getItem("token") ?? "";
    const options = token.length > 0
        ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        : {};

    let response = {} as {
        data: {
            data: object;
        };
        status: number;
    };
    if (method === "DELETE") {
        response = await axios.delete(`${apiLocation}${url}`, options);
    } else if (method === "POST") {
        response = await axios.post(`${apiLocation}${url}`, payload, options);
    } else if (method === "PUT") {
        response = await axios.put(`${apiLocation}${url}`, payload, options);
    } else {
        response = await axios.get(`${apiLocation}${url}`, options);
    }
    return { data: response.data.data, status: response.status };
};
