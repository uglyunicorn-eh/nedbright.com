import { SvgSpinners180RingWithBg } from "src/components/react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export const Button = ({ loading, disabled, className, children, ...props }: Props) => {
  className = `flex gap-3 transition-all ${className}`.trim();
  return (
    <button className={className} disabled={disabled || loading} {...props}>
      {loading && (
        <SvgSpinners180RingWithBg className="w-6 h-6" />
      )}
      {children}
    </button>
  );
}
