/**
 * Generate a random password
 * @returns The generated password as a string
 */
const randomPassword = (): string => {
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    return password;
};

export default randomPassword;
