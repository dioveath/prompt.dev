import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";

const navitem = cva("cursor-pointer flex justify-center items-center", {
  variants: {
    isActive: {
      true: "text-purple-500",
      false: "text-black",
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

export interface NavItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof navitem> {}

export default function NavItem({
  children,
  path,
  mypath,
}: {
  children: React.ReactNode;
  path: string;
  mypath: string;
}) {
  return (
    <li className={navitem({ isActive: path === mypath })}> 
      {/* <Link href={`/${mypath}`}> */}
        {children}       
      {/* </Link> */}
    </li>
  );
}
