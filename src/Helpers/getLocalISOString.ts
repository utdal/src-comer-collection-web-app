const getLocalISOString = (dateISOString: string): string => {
    const date = new Date(dateISOString);

    const yearValue: number = date.getFullYear();
    const monthValue: number = date.getMonth() + 1;
    const dayOfMonthValue: number = date.getDate();
    const hourValue: number = date.getHours();
    const minuteValue: number = date.getMinutes();

    const displayYear = `${yearValue}`;
    const displayMonth = monthValue < 10 ? `0${monthValue}` : `${monthValue}`;
    const displayDayOfMonth = dayOfMonthValue < 10 ? `0${dayOfMonthValue}` : dayOfMonthValue;
    const displayHour = hourValue < 10 ? `0${hourValue}` : `${hourValue}`;
    const displayMinute = minuteValue < 10 ? `0${minuteValue}` : `${minuteValue}`;

    return `${displayYear}-${displayMonth}-${displayDayOfMonth}T${displayHour}:${displayMinute}`;
};

export default getLocalISOString;
