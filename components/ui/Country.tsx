type CountryProps = {
  country: "FR" | "UK";
  size?: number;
};

function FRFlag({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="France">
      <clipPath id="fr-circle">
        <circle cx="14" cy="14" r="14" />
      </clipPath>
      <g clipPath="url(#fr-circle)">
        {/* White base */}
        <rect width="28" height="28" fill="#F5F5F5" />
        {/* Blue left band — left 33.33% */}
        <rect x="0" y="0" width="9.33" height="28" fill="#002395" />
        {/* Red right band — right 33.33% */}
        <rect x="18.67" y="0" width="9.33" height="28" fill="#ED2939" />
      </g>
    </svg>
  );
}

function UKFlag({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="United Kingdom">
      <clipPath id="uk-circle">
        <circle cx="14" cy="14" r="14" />
      </clipPath>
      <g clipPath="url(#uk-circle)">
        {/* Background */}
        <rect width="28" height="28" fill="#012169" />
        {/* White diagonals */}
        <path d="M0 0L28 28M28 0L0 28" stroke="white" strokeWidth="5.6" />
        {/* Red diagonals */}
        <path d="M0 0L28 28M28 0L0 28" stroke="#C8102E" strokeWidth="3.73" />
        {/* White cross */}
        <path d="M14 0V28M0 14H28" stroke="white" strokeWidth="9.33" />
        {/* Red cross */}
        <path d="M14 0V28M0 14H28" stroke="#C8102E" strokeWidth="5.6" />
      </g>
    </svg>
  );
}

export default function Country({ country, size = 28 }: CountryProps) {
  return (
    <span className="rounded-full overflow-hidden shrink-0 block" style={{ width: size, height: size }}>
      {country === "FR" ? <FRFlag size={size} /> : <UKFlag size={size} />}
    </span>
  );
}
