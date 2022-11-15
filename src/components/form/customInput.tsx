import React from "react";

export const CustomInput = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    errorMessage?: string;
  }
  // ts 的には "rest" には何もないが、Fromコンポーネントによって
  // register の return 値が追加される
>(function Input({ errorMessage, name, ...rest }, ref) {
  return (
    <div className="flex border border-blue-500">
      <input name={name} ref={ref} {...rest} className="w-full p-2" />
      {!!errorMessage && <span role="alert">{errorMessage}</span>}
    </div>
  );
});
