import type React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function Logo({ size = 32, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EcoRoute AI Logo"
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 15.08C16.08 15.93 15.18 16.5 14 16.5C12.34 16.5 11 15.16 11 13.5V11C11 10.45 10.55 10 10 10H8V8H10C11.1 8 12 8.9 12 10V11.5C12 12.05 12.45 12.5 13 12.5H14C14.55 12.5 15 12.05 15 11.5V10C15 9.26 14.5 8.64 13.84 8.28L14.54 7.58C15.6 8.19 16.27 9.26 16.44 10.5H17V12H16.42C16.28 13.44 15.4 14.64 14.18 15.23L14.88 15.93C15.81 15.54 16.35 14.66 16.5 13.58V15.08Z"
        fill="currentColor"
      />
       <path d="M9 12c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zm3-2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" fill="currentColor" opacity="0.7"/>
      <path d="M12 17.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 12.5 12 12.5s2.5 1.12 2.5 2.5-.01 2.5-2.5 2.5zM10.5 8.5C9.67 8.5 9 9.17 9 10s.67 1.5 1.5 1.5S12 10.83 12 10s-.67-1.5-1.5-1.5z" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}
