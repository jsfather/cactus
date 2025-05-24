const API_BASE_URL = 'https://kaktos.kanoonbartarha.ir/api';

export const sendOtp = async (phone: string) => {
  const response = await fetch(`${API_BASE_URL}/send_otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  });

  if (!response.ok) {
    throw new Error('Failed to send OTP');
  }

  return await response.json();
};

export const verifyOtp = async (
  phone: string,
  password: string,
  otp: string
) => {
  const response = await fetch(`${API_BASE_URL}/verify_otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, password, otp }),
  });

  if (!response.ok) {
    throw new Error('OTP verification failed');
  }

  return await response.json();
};
