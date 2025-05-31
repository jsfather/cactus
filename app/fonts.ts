import localFont from 'next/font/local';

const dana = localFont({
  src: [
    {
      path: './fonts/dana/Dana-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/dana/Dana-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/dana/Dana-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/dana/Dana-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/dana/Dana-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/dana/Dana-DemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/dana/Dana-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/dana/Dana-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/dana/Dana-Black.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-dana',
});

const danaFaNum = localFont({
  src: [
    {
      path: './fonts/dana/DanaFaNum-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/dana/DanaFaNum-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/dana/DanaFaNum-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/dana/DanaFaNum-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/dana/DanaFaNum-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/dana/DanaFaNum-DemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/dana/DanaFaNum-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/dana/DanaFaNum-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/dana/DanaFaNum-Black.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-dana-fanum',
});

export { dana, danaFaNum };
