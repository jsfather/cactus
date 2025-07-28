// Debug script برای بررسی environment variables
console.log('Environment Variables Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log(
  'NEXT_PUBLIC_PASSWORD_AUTH_ENABLED:',
  process.env.NEXT_PUBLIC_PASSWORD_AUTH_ENABLED
);

// این script در کنسول مرورگر قابل اجرا است
if (typeof window !== 'undefined') {
  console.log('Client-side environment variables:');
  console.log(
    'API_URL would be:',
    process.env.NEXT_PUBLIC_API_URL || 'https://kaktos.kanoonbartarha.ir/api'
  );
}
