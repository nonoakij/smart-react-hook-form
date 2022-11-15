import React, { ReactNode } from "react";
import { deepMap } from "react-children-utilities";
import { XOR } from "ts-xor";
import {
  FieldValues,
  useForm,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
  SubmitErrorHandler,
} from "react-hook-form";
import { CustomInput } from "./customInput";

type FormProps<TFieldValues extends FieldValues, TContext = any> = {
  children: (args: UseFormReturn<TFieldValues, TContext>) => ReactNode;
  className?: string;
  options?: UseFormProps<TFieldValues, TContext>;
};

/**
 * onInvalid は onValid がないと意味がないので型的に縛る
 */
type FormPropsWithSubmitFunction<
  TFieldValues extends FieldValues,
  TContext = any
> = FormProps<TFieldValues, TContext> & {
  onValid: SubmitHandler<TFieldValues>;
  onInvalid?: SubmitErrorHandler<TFieldValues>;
};

export const Form = <TFieldValues extends FieldValues, TContext = any>(
  props: XOR<
    FormProps<TFieldValues, TContext>,
    FormPropsWithSubmitFunction<TFieldValues, TContext>
  >
) => {
  const methods = useForm<TFieldValues, TContext>(props.options);
  const onSubmit =
    props.onValid && methods.handleSubmit(props.onValid, props.onInvalid);

  return (
    <form onSubmit={onSubmit} className={props.className}>
      {deepMap(props.children(methods), (child) => {
        /**
         * ReactElement 以外は、なにもする必要がないので、そのままにしておく
         */
        if (!React.isValidElement(child)) {
          return child;
        }
        /**
         * props.name があれば register した結果をprops に詰めておく
         */
        return child.props.name
          ? React.cloneElement(child, {
              ...child.props,
              // type attributes みて必要な option を追加する
              ...methods.register(child.props.name, {
                valueAsDate: child.props.type === "date",
                valueAsNumber: child.props.type === "number",
              }),
              key: child.props.name,
            })
          : child;
      })}
    </form>
  );
};

Form.CustomInput = CustomInput;
