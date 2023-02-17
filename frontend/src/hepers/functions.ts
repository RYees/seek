export const intlCompactNumFormat = function (
    num: number,
    locale: string = "en-US"
) {
    return new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
    }).format(num);
};
