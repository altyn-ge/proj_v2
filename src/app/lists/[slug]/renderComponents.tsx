import { ComponentProps, ElementType } from "react";

export const renderComponents: Record<string, ElementType> = {
  a: (props: ComponentProps<"a">) => (
    <a
      className="hover:underline cursor-pointer"
      target="_blank"
      rel="noopener noreferrer nofollow"
      {...props}
    />
  ),
  table: (props: ComponentProps<"table">) => {
    const { children, ...rest } = props;
    return (
      <div className="overflow-x-auto">
        <table
          className="min-w-full border-collapse border bg-layer text-sm"
          {...rest}
        >
          {children}
        </table>
      </div>
    );
  },
  th: (props: ComponentProps<"th">) => (
    <th className="border px-2 py-1" {...props} />
  ),
  td: (props: ComponentProps<"td">) => (
    <td className="border px-2 py-1" {...props} />
  ),
  mark: (props: ComponentProps<"mark">) => (
    <mark className="bg-transparent" {...props} />
  ),
};
