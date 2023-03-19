import { cva, type VariantProps } from "class-variance-authority";

const button = cva("cursor-pointer px-8 py-1 rounded-full", {
  variants: {
    intent: {
      primary: "bg-purple-600 text-white",
      secondary: "bg-gray-200 text-black",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

export interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export default function Button({ children, intent, ...props }: ButtonProps) {
  return (
    <button className={button({ intent })} {...props}>
      {children}
    </button>
  );
}
