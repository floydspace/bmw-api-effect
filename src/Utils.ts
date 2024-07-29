import { createHash, randomBytes } from "node:crypto";

export const generateToken = (length = 30) => {
  const chars = String.fromCharCode(
    ...Array.from({ length: 26 }, (_, i) => i + 97),
    ...Array.from({ length: 26 }, (_, i) => i + 65),
    ...Array.from({ length: 10 }, (_, i) => i + 48),
    45,
    46,
    95,
    126,
  );
  return [...randomBytes(length)]
    .map((byte) => chars[byte % chars.length])
    .join("");
};

export const createS256CodeChallenge = (codeVerifier: string) => {
  const data = createHash("sha256").update(codeVerifier).digest();
  const base64Data = data.toString("base64");
  return base64Data.replace(/=+$/, ""); // Remove trailing '=' characters
};

export const parseQueryParams = (input: string) =>
  Object.fromEntries(new URL(input).searchParams);
