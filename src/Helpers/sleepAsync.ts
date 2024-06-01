const sleepAsync = async (timeoutMs: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeoutMs);
    });
};

export default sleepAsync;
