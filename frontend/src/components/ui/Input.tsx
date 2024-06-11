import { observer } from "mobx-react-lite";
import { useTestStore } from "../../context/TestContext";

type LabelProps = {
  label: string;
};

const Label = ({ label }: LabelProps) => {
  return (
    <label
      htmlFor={label}
      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
    >
      {label}
    </label>
  );
};

type InputProps = {
  type: string;
  onChange: any;
  name: string;
  id: string;
  placeholder: string;
  defaultValue: string;
  value?: string;
  disabled: boolean;
  required: boolean;
};

const Input = ({
  type,
  onChange,
  name,
  id,
  placeholder,
  value,
  defaultValue,
  disabled,
  required,
}: InputProps) => {
  return (
    <input
      onChange={onChange}
      type={type}
      name={name}
      id={id}
      className="dark:bg-gray-900 dark:text-white block text-sm leading-6 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 dark:focus:ring-green-600 sm:text-sm sm:leading-6"
      placeholder={placeholder}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
      value={value}
    />
  );
};

type TextAreaProps = {
  onChange: any;
  name: string;
  id: string;
  placeholder: string;
  defaultValue: string;
  rows: number;
};

const TextArea = ({
  onChange,
  name,
  id,
  placeholder,
  defaultValue,
  rows,
}: TextAreaProps) => {
  return (
    <textarea
      onChange={onChange}
      name={name}
      id={id}
      rows={rows}
      className="dark:bg-gray-900 dark:text-white block text-sm leading-6 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 dark:focus:ring-green-600 sm:text-sm sm:leading-6"
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
};

type SelectProps = {
  id: string;
  onChange: any;
  name: string;
  value: string;
  defaultValue?: string;
  items: { name: string; value: string }[];
};

const Select = ({
  id,
  onChange,
  name,
  value,
  defaultValue,
  items,
}: SelectProps) => {
  return (
    <select
      id={id}
      onChange={onChange}
      name={name}
      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6"
      defaultValue={defaultValue}
      value={value}
    >
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.name}
        </option>
      ))}
    </select>
  );
};

const HeaderInput = observer(({ header }: any) => {
  const testStore: any = useTestStore();
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 space-x-2">
        <div className="">
          <Input
            type="text"
            name="key"
            id="key"
            placeholder="Authorization"
            defaultValue=""
            disabled={false}
            required={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              testStore.handleHeaderInputChange(
                e.target.name,
                e.target.value,
                header.id
              )
            }
          />
        </div>
        <div className="flex ">
          <Input
            type="text"
            name="value"
            id="key"
            placeholder="Authorization"
            defaultValue=""
            disabled={false}
            required={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              testStore.handleHeaderInputChange(
                e.target.name,
                e.target.value,
                header.id
              )
            }
          />
          <button
            className="text-white ml-2"
            onClick={() => testStore.removeHeader(header.id)}
          >
            X
          </button>
        </div>
      </div>
    </>
  );
});

type EndpointInputProps = {
  endpoint: {
    id: string;
    key: string;
    value: string;
    Method: string;
  };
  selectItems: { name: string; value: string }[];
};

const EndpointInput = observer(
  ({ endpoint, selectItems }: EndpointInputProps) => {
    const testStore: any = useTestStore();

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 space-x-2">
          <div className="col-span-2">
            <Input
              type="text"
              name="URL"
              id="endpoint"
              placeholder="/api/v1/users"
              defaultValue=""
              disabled={false}
              required={true}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                testStore.handleEndpointChange(
                  e.target.value,
                  e.target.name,
                  endpoint.id
                )
              }
            />
          </div>
          <div className="flex col-span-1">
            <Select
              id="method"
              name="Method"
              value={endpoint.value}
              items={selectItems}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                testStore.handleEndpointChange(
                  e.target.value,
                  e.target.name,
                  endpoint.id
                )
              }
            />
            <button
              className="text-white ml-2"
              onClick={() => testStore.removeEndpoint(endpoint.id)}
            >
              X
            </button>
          </div>
        </div>
        {endpoint.Method && endpoint.Method === "POST" && (
          <div className="col-span-3">
            <TextArea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                testStore.handleEndpointChange(
                  JSON.parse(e.target.value),
                  e.target.name,
                  endpoint.id
                )
              }
              name="Data"
              id="body"
              placeholder="Request body"
              defaultValue=""
              rows={3}
            />
          </div>
        )}
      </>
    );
  }
);

export { Label, Input, TextArea, Select, HeaderInput, EndpointInput };
