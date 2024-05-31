import { Exhibition } from "../Classes/Entities/Exhibition.ts";

export const myExhibitionsAction = async ({ request }) => {
    const requestData = await request.json();
    if (request.method === "POST") {
        try {
            await Exhibition.handleMultiCreate([requestData]);
            return {
                status: "success",
                message: "Exhibition created"
            };
        } catch (e) {
            return {
                status: "error",
                error: e.message
            };
        }
    } else if (request.method === "PUT") {
        const { id, ...requestBody } = requestData;
        try {
            const result = await Exhibition.handleEdit(id, requestBody);
            return {
                status: "success",
                message: result
            };
        } catch (e) {
            return {
                status: "error",
                error: e.message
            };
        }
    } else {
        throw new Response(null, { status: 405 });
    }
};
