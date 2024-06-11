import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { useParams } from "react-router-dom";
import Chart from "./chart/Chart";
import ResultsTable from "./results/ResultsTable";
import rocketapi from "../api/config";
import toast from "react-hot-toast";
import {
  Card,
  classNames,
  PageHeader,
  ValueDisplay,
} from "@rcktsftwr/components";
import EndpointsTable from "./endpoints/EndpointsTable";

const socketUrl = "ws://localhost:8000/";

const LoadTest = () => {
  const params = useParams();

  // const navigate = useNavigate();

  // const [test, setTest] = useState<any>({});
  const [testConfig, setTestConfig] = useState<any>({});
  const [testEndpoints, setTestEndpoints] = useState<any[]>([]);
  const [testHeaders, setTestHeaders] = useState<any[]>([]);

  const getTestById = async () => {
    await rocketapi
      .from("tests")
      .byId(params.id ?? "")
      .get()
      .then((response: any) => {
        setTestConfig({
          base_url: response.base_url,
          duration: response.duration,
          rps: response.rps,
          use_statistical_distribution: response.use_statistical_distribution,
        });
        setTestEndpoints(JSON.parse(response.endpoints));
        setMessages(
          JSON.parse(response.endpoints).map((endpoint: any) => ({
            endpoint: endpoint.URL,
            counter: 0,
            duration: 0,
            method: endpoint.Method,
          }))
        );
        setTestHeaders(JSON.parse(response.headers));
        console.log(response);
      });
  };

  useEffect(() => {
    getTestById();
  }, []);

  // headers as an object
  const headersObject: { [key: string]: string } | undefined =
    testHeaders?.reduce((acc, header) => {
      acc[header.key] = header.value;
      return acc;
    }, {} as { [key: string]: string });

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl + params.id
  );

  useEffect(() => {
    console.log("Ready state: ", readyState);
    if (readyState === 1) {
      console.log("Connection established");
      toast.success("Connection established");
    }
    if (readyState === 3) {
      console.log("Connection closed");
      toast.error("Connection closed");
    }
  }, [readyState]);

  const [messages, setMessages] = useState<
    { endpoint: string; counter: number; duration: number; status?: number; method?: string }[]
  >([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [results, setResults] = useState<{
    actual_requests_per_sec: number;
    average_response_time: number;
    endpoint_stats: { [key: string]: { Count: number; TotalTime: number } };
    failed_requests: number;
    failure_rate: number;
    max_response_time: number;
    min_response_time: number;
    total_requests: number;
    requests_per_second: { [key: string]: number };
    success_rate: number;
    successful_requests: number;
  }>({
    actual_requests_per_sec: 0,
    average_response_time: 0,
    endpoint_stats: {},
    failed_requests: 0,
    failure_rate: 0,
    max_response_time: 0,
    min_response_time: 0,
    total_requests: 0,
    requests_per_second: {},
    success_rate: 0,
    successful_requests: 0,
  });

  const parseBool = (value: string): boolean => {
    if (value === "true") {
      return true;
    }
    return false;
  };

  const handleClickSendMessage = async () => {
    console.log("Starting test");
    const message = {
      config: {
        BaseUrl: testConfig.base_url,
        DurationInSeconds: parseInt(testConfig.duration),
        RequestsPerSecond: parseInt(testConfig.rps),
        UseStatisicalDistribution: parseBool(
          testConfig.use_statistical_distribution
        ),
        headers: headersObject,
      },
      endpoints: testEndpoints,
    };

    toast.success("Test started");
    console.log("Sending message", message);
    sendMessage(JSON.stringify(message));
  };

  const calcAverage = (c: number, avg: number, last: number): number => {
    return Math.floor((avg * (c - 1) + last) / c);
  };

  const updateChartData = (data: any[]) => {
    const requestsToDisplay = parseInt(testConfig.duration) * 3;

    if (chartData.length > requestsToDisplay) {
      const updatedChartData = chartData.slice(1);
      updatedChartData.push(data);
      setChartData(updatedChartData);
      return;
    }

    setChartData([...chartData, data]);
  };

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      handleMessage(data);
      updateChartData(data);
      console.log(data);
    }
  }, [lastMessage]);

  const handleMessage = (message: any) => {
    if (message.metrics) {
      setResults(message.metrics);
      toast.success("Test completed");
    }

    if (!message.url) {
      return;
    }

    const index = messages.findIndex((m) => m.endpoint === message.url);
    if (index === -1) {
      setMessages([
        ...messages,
        {
          endpoint: message.url,
          counter: 1,
          duration: message.response_time_ms,
          status: message.status_code,
        },
      ]);
    } else {
      const updatedMessages: {
        endpoint: string;
        counter: number;
        duration: number;
        status?: number;
      }[] = [...messages];

      updatedMessages[index].counter += 1;
      updatedMessages[index].status = message.status_code;
      updatedMessages[index].duration = calcAverage(
        updatedMessages[index].counter,
        updatedMessages[index].duration,
        message.response_time_ms
      );
      //updateChartData([...updatedMessages[index], { url: message.url, response_time_ms: message.response_time_ms }]);

      setMessages(updatedMessages);
    }
  };

  return (
    <>
      <PageHeader
        headline="Run API Load Test"
        subline={`Test ID: ${params.id}`}
        backButtonLink="/"
        backButtonText="back"
        saveButton={true}
        saveButtonText="Start Test"
        saveButtonOnClick={handleClickSendMessage}
      />
      {/* <p className="text-lg text-gray-600">Test ID: {params.id}</p> */}

      <Card headline="Test cofiguration">
        {testConfig && (
          <div className="flex">
            {/* <ValueDisplay label="Test name" value={} /> */}
            <ValueDisplay label="Base URL" value={testConfig.base_url} />
            <ValueDisplay label="Duration" value={testConfig.duration} />
            <ValueDisplay label="RPS" value={testConfig.rps} />
            <ValueDisplay
              label="Use statistical distribution"
              value={testConfig.use_statistical_distribution ? "Yes" : "No"}
            />
          </div>
        )}
      </Card>

      <Card headline="Endpoints">
        {testEndpoints && (
          <div>
            <EndpointsTable data={messages} />
          </div>
        )}
      </Card>
      {
        <div
          className={classNames(
            results.total_requests > 0
              ? "grid grid-cols-1 md:grid-cols-2"
              : "grid grid-cols-1",
            "space-x-2"
          )}
        >
          <Chart data={chartData} />
          {results.total_requests > 0 ? <ResultsTable data={results} /> : null}
        </div>
      }
    </>
  );
};

export default LoadTest;
