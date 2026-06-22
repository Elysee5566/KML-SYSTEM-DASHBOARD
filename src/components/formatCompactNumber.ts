export const formatCompactNumber = (
    amount: number | string,
    compact = false
): string => {
    const num = Number(amount);

    if (isNaN(num)) return "0";

    if (!compact) {
        return num.toLocaleString("en-US");
    }

    const abs = Math.abs(num);

    const truncate = (value: number, decimals = 3) => {
        const factor = Math.pow(10, decimals);
        return Math.trunc(value * factor) / factor;
    };

    if (abs >= 1_000_000_000) {
        return `${truncate(num / 1_000_000_000)}B`;
    }

    if (abs >= 1_000_000) {
        return `${truncate(num / 1_000_000)}M`;
    }

    if (abs >= 1_000) {
        return `${truncate(num / 1_000)}K`;
    }

    return num.toLocaleString("en-US");
};