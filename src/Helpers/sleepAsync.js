export const sleepAsync = async (timeoutMs) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeoutMs);
    });
};
