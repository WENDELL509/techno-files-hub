import logo from "@/assets/falcon-logo.jpg";

export const Logo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <img
    src={logo}
    alt="Falcon Geosolutions"
    className={`${className} object-contain rounded-md`}
  />
);
