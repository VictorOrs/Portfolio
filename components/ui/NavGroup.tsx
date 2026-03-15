import NavLink from "@/components/ui/NavLink";

type NavItem = {
  label: string;
  href: string;
};

type NavGroupProps = {
  items?: NavItem[];
  scrolled?: boolean;
  className?: string;
};

const defaultItems: NavItem[] = [
  { label: "Home",    href: "/" },
  { label: "About",   href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Work",    href: "/work" },
  { label: "FAQ",     href: "/faq" },
];

export default function NavGroup({ items = defaultItems, scrolled = false, className }: NavGroupProps) {
  return (
    <nav
      className={[
        // Layout
        "inline-flex items-center justify-center gap-1 p-1 rounded-full",
        // Border — outline doesn't affect box size (same approach as secondary button)
        "outline outline-2 outline-alpha outline-offset-[-2px]",
        // Blur — always active
        "backdrop-blur-glass",
        // Scrolled: fill with alpha background
        scrolled ? "bg-alpha" : "",
        // Transition
        "transition-all duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => (
        <NavLink key={item.href} href={item.href}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
