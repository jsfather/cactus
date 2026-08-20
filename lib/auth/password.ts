import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return `scrypt:${salt.toString("base64url")}:${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [algorithm, saltValue, hashValue] = encodedHash.split(":");

  if (algorithm !== "scrypt" || !saltValue || !hashValue) {
    return false;
  }

  const salt = Buffer.from(saltValue, "base64url");
  const storedHash = Buffer.from(hashValue, "base64url");
  const derivedKey = (await scrypt(password, salt, storedHash.length)) as Buffer;

  return (
    storedHash.length === derivedKey.length &&
    timingSafeEqual(storedHash, derivedKey)
  );
}
