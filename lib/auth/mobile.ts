const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

export function toLatinDigits(value: string) {
  return Array.from(value, (character) => {
    const persianIndex = persianDigits.indexOf(character);
    if (persianIndex >= 0) return String(persianIndex);
    const arabicIndex = arabicDigits.indexOf(character);
    return arabicIndex >= 0 ? String(arabicIndex) : character;
  }).join("");
}

export function normalizeOtpCode(value: string) {
  const code = toLatinDigits(value).replace(/\D/g, "");
  return /^\d{6}$/.test(code) ? code : null;
}

export function normalizeIranianMobile(value: string) {
  const digits = toLatinDigits(value).replace(/[^\d+]/g, "");
  const national = digits.startsWith("+98")
    ? `0${digits.slice(3)}`
    : digits.startsWith("0098")
      ? `0${digits.slice(4)}`
      : digits.startsWith("98")
        ? `0${digits.slice(2)}`
        : digits.startsWith("9")
          ? `0${digits}`
          : digits;

  return /^09\d{9}$/.test(national) ? national : null;
}

export function maskMobile(mobile: string) {
  return `${mobile.slice(0, 4)}•••${mobile.slice(-4)}`;
}
