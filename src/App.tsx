import { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { Form } from "./components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";

const schema = z.object({
  username: z.string().email(),
  password: z.string().min(5, { message: "５文字以上である必要があります" }),
  age: z.number(),
  date: z.date(),
  disabledInput: z.string(),
  bloodType: z.string(),
  customComponentInput: z.string(),
});

type Schema = z.infer<typeof schema>;

function App() {
  const [formData, setFormData] = useState<Schema | {}>({});
  const onValid: SubmitHandler<Schema> = (data) => {
    setFormData(data);
  };
  const onInvalid: SubmitErrorHandler<Schema> = (...data) => {
    console.error(data);
  };

  return (
    <>
      <section className="border border-red-500 border-dotted p-8 m-8">
        <h1>Result</h1>
        {JSON.stringify(formData)}
      </section>
      <Form<Schema>
        className="border border-red-500 border-dotted p-8 m-8"
        options={{
          resolver: zodResolver(schema),
          defaultValues: { disabledInput: "disabled input value" },
        }}
        onValid={onValid}
        onInvalid={onInvalid}
      >
        {({ formState: { errors } }) => {
          return (
            <>
              <div className="flex flex-col space-y-4">
                <label>
                  username:
                  <input
                    name="username"
                    placeholder="sample@example.com"
                    className="border"
                  />
                </label>
                <label>
                  password:
                  <input name="password" type="password" className="border" />
                  {errors.password && (
                    <span role="alert" className="text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </label>
                <label>
                  age:
                  <input
                    name="age"
                    placeholder="26"
                    type="number"
                    className="border"
                  />
                </label>
                <label>
                  date:
                  <input name="date" type="date" className="border" />
                </label>
                <input name="disabledInput" disabled className="border" />
                <select name="bloodType" className="border">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="O">O</option>
                  <option value="AB">AB</option>
                </select>
                <label>
                  component input:
                  <Form.CustomInput
                    name="customComponentInput"
                    errorMessage={errors.customComponentInput?.message}
                  />
                </label>
              </div>
              <input type="submit" className="mt-8" />
            </>
          );
        }}
      </Form>
    </>
  );
}

export default App;
