import * as React from "react";

export const Textarea = React.forwardRef(({ ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className="border rounded px-2 py-1 w-full"
      rows={4}
      {...props}
    />
  );
});
