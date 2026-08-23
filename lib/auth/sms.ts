import "server-only";

type KavenegarResponse = {
  return?: { status?: number; message?: string };
};

export class SmsDeliveryError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "SmsDeliveryError";
  }
}

export type SmsDeliveryResult = {
  developmentCode?: string;
};

export async function sendAuthenticationCode(mobile: string, code: string): Promise<SmsDeliveryResult> {
  const provider = process.env.SMS_PROVIDER?.trim().toLowerCase() ||
    (process.env.NODE_ENV === "production" ? "kavenegar" : "console");

  if (provider === "console") {
    if (process.env.NODE_ENV === "production") {
      throw new SmsDeliveryError("The console SMS provider is disabled in production.");
    }
    console.info(`[development OTP] ${mobile}: ${code}`);
    return { developmentCode: code };
  }

  if (provider !== "kavenegar") {
    throw new SmsDeliveryError(`Unsupported SMS provider: ${provider}`);
  }

  const apiKey = process.env.KAVENEGAR_API_KEY?.trim();
  const template = process.env.KAVENEGAR_VERIFY_TEMPLATE?.trim();
  if (!apiKey || !template) {
    throw new SmsDeliveryError("Kavenegar is not configured.");
  }

  const endpoint = new URL(
    `https://api.kavenegar.com/v1/${encodeURIComponent(apiKey)}/verify/lookup.json`,
  );
  endpoint.search = new URLSearchParams({
    receptor: mobile,
    token: code,
    template,
  }).toString();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new SmsDeliveryError("Kavenegar could not be reached.", { cause: error });
  }

  const result = (await response.json().catch(() => null)) as KavenegarResponse | null;
  if (!response.ok || result?.return?.status !== 200) {
    throw new SmsDeliveryError(
      `Kavenegar rejected the request (${result?.return?.status ?? response.status}).`,
    );
  }

  return process.env.NODE_ENV === "production" ? {} : { developmentCode: code };
}
