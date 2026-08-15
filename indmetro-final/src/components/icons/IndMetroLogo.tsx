interface IndMetroLogoProps {
  size?: number;
  className?: string;
}

export const IndMetroLogo = ({ size = 40, className = "" }: IndMetroLogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Rounded square bg */}
    <rect width="40" height="40" rx="10" fill="currentColor" className="text-primary" />

    {/* "M" shape built from metro track lines */}
    {/* Left vertical */}
    <rect x="7" y="11" width="4" height="18" rx="2" fill="white" />
    {/* Right vertical */}
    <rect x="29" y="11" width="4" height="18" rx="2" fill="white" />
    {/* Left diagonal down */}
    <rect
      x="10"
      y="14"
      width="4"
      height="12"
      rx="2"
      fill="white"
      transform="rotate(30 10 14)"
    />
    {/* Right diagonal down */}
    <rect
      x="26"
      y="14"
      width="4"
      height="12"
      rx="2"
      fill="white"
      transform="rotate(-30 30 14)"
    />

    {/* Station dots on the lines */}
    <circle cx="9" cy="13" r="2.2" fill="white" opacity="0.9" />
    <circle cx="9" cy="27" r="2.2" fill="white" opacity="0.9" />
    <circle cx="20" cy="22" r="2.5" fill="white" />
    <circle cx="31" cy="13" r="2.2" fill="white" opacity="0.9" />
    <circle cx="31" cy="27" r="2.2" fill="white" opacity="0.9" />
  </svg>
);

export default IndMetroLogo;
