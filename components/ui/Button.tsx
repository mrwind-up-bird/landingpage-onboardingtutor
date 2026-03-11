import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary";

type BaseProps = {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type Props = ButtonProps | LinkProps;

const styles: Record<Variant, string> = {
  primary:
    "font-mono text-sm font-semibold text-void bg-cyan border-none px-8 py-3.5 rounded-lg cursor-pointer no-underline transition-all relative overflow-hidden hover:shadow-[var(--glow-cyan)] hover:-translate-y-0.5",
  secondary:
    "font-mono text-sm font-medium text-cyan bg-transparent border border-cyan/25 px-8 py-3.5 rounded-lg cursor-pointer no-underline transition-all hover:bg-cyan/[0.06] hover:border-cyan/50",
  tertiary:
    "font-mono text-sm font-medium text-text-muted bg-transparent border-none px-6 py-3.5 cursor-pointer no-underline transition-colors hover:text-cyan relative after:absolute after:bottom-2.5 after:left-6 after:right-6 after:h-px after:bg-text-dim hover:after:bg-cyan after:transition-colors",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: Props) {
  const classes = `${styles[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    return (
      <a
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
