import { Form, FormSection, FormSectionItem } from "./ui/Forms";
import { EndpointInput, Input, Label, Select, HeaderInput } from "./ui/Input";
import { observer } from "mobx-react-lite";
import { useTestStore } from "../context/TestContext";
import { toJS } from "mobx";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "./ui/Buttons";
import { PageHeader } from "@rcktsftwr/components";
import rocketapi from "../api/config";

const CreateLoadTest = observer(() => {
  const testStore: any = useTestStore();
  const navigate = useNavigate();

  const selectItems = [
    { name: "GET", value: "GET" },
    { name: "POST", value: "POST" },
    { name: "PUT", value: "PUT" },
    { name: "DELETE", value: "DELETE" },
  ];

  console.log(
    toJS(testStore.config),
    toJS(testStore.endpoints),
    toJS(testStore.headers)
  );

  const createLoadTest = async (event: any) => {
    event.preventDefault();
    console.log(
      "Creating load test with data:",
      toJS(testStore.config),
      toJS(testStore.endpoints)
    );

    // send data to server
    await rocketapi
      .from("tests")
      .create({
        config: testStore.config,
        headers: testStore.headers,
        endpoints: testStore.endpoints,
      })
      .then((response: any) => {
        console.log("Response:", response);
        navigate("/" + response.id);
      })
      .catch((error: any) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <PageHeader headline="Create Load Test 🚀" />

      <Form
        submitLabel="Start Test"
        cancelLabel="Clear"
        onSubmit={createLoadTest}
      >
        <FormSection headline="Config">
          <FormSectionItem>
            <Label label="Base URL" />
            <Input
              type="text"
              name="baseUrl"
              id="baseUrl"
              placeholder="https://example.com"
              defaultValue=""
              disabled={false}
              required={true}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                testStore.handleInputChange(e.target.value, e.target.id)
              }
            />
          </FormSectionItem>
          <FormSectionItem>
            <Label label="Duration (seconds)" />
            <Input
              type="number"
              name="duration"
              id="durationInSeconds"
              placeholder="60"
              defaultValue=""
              disabled={false}
              required={true}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                testStore.handleInputChange(e.target.value, e.target.id)
              }
            />
          </FormSectionItem>
          <FormSectionItem>
            <Label label="RPS" />
            <Input
              type="number"
              name="rps"
              id="requestsPerSecond"
              placeholder="10"
              defaultValue=""
              disabled={false}
              required={true}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                testStore.handleInputChange(e.target.value, e.target.id)
              }
            />
          </FormSectionItem>
          <FormSectionItem>
            <Label label="Use statistical distribution" />
            <Select
              name="distribution"
              id="useStatisticalDistribution"
              value={testStore.config.UseStatisticalDistribution}
              items={[
                { name: "true", value: "true" },
                { name: "false", value: "false" },
              ]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                testStore.handleInputChange(e.target.value, e.target.id)
              }
            />
          </FormSectionItem>
          <FormSectionItem>
            <Label label="Headers" />
            <PrimaryButton
              label="Add Header"
              onClick={() => testStore.addHeader()}
            />
            <div className="my-2"></div>
            <div className=" space-y-2">
              {testStore.headers.map((header: any) => (
                <HeaderInput key={header.id} header={header} />
              ))}
            </div>
          </FormSectionItem>
        </FormSection>

        <FormSection headline="Endpoints">
          <FormSectionItem>
            <PrimaryButton
              label="Add Endpoint"
              onClick={() => testStore.addEndpoint()}
            />
            <div className="my-2"></div>
            <div className=" space-y-2">
              {testStore.endpoints.map((endpoint: any) => (
                <EndpointInput
                  key={endpoint.id}
                  endpoint={endpoint}
                  selectItems={selectItems}
                />
              ))}
            </div>
          </FormSectionItem>
        </FormSection>
      </Form>
    </>
  );
});

export default CreateLoadTest;
