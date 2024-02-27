import { cn } from "@/lib/utils";
import { FC, HTMLProps } from "react";

interface TContainerProps extends HTMLProps<HTMLDivElement> {}
const Container: FC<TContainerProps> = ({ children, className, ...rest }) => {
  return (
    <div className={cn(className, "max-w-screen-xl px-4 mx-auto")} {...rest}>
      {children}
    </div>
  );
};

export default Container;
