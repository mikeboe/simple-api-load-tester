import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { PrimaryButton, SecondaryButton } from "./ui/Buttons";
import qs from "qs";
import { useNavigate, useParams } from "react-router-dom";
import Chart from "./chart/Chart";
import { Card } from "@rcktsftwr/components";
import ResultsTable from "./results/ResultsTable";

const socketUrl = "ws://localhost:8000/";

const LoadTest = () => {
  const params = useParams();

  const navigate = useNavigate();

  type URLProps = {
    config: {
      BaseUrl: string;
      DurationInSeconds: string;
      RequestsPerSecond: string;
      UseStatisicalDistribution: string;
    };
    headers: {
      key: string;
      value: string;
    }[];
    endpoints: {
      Method: string;
      URL: string;
    }[];
  };

  const { config, headers, endpoints }: URLProps = qs.parse(
    window.location.search,
    { ignoreQueryPrefix: true }
  ) as URLProps;

  // headers as an object
  const headersObject: { [key: string]: string } | undefined = headers?.reduce(
    (acc, header) => {
      acc[header.key] = header.value;
      return acc;
    },
    {} as { [key: string]: string }
  );

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl + params.id
  );

  const [messages, setMessages] = useState<
    { endpoint: string; counter: number; duration: number }[]
  >([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

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
        BaseUrl: config.BaseUrl,
        DurationInSeconds: parseInt(config.DurationInSeconds),
        RequestsPerSecond: parseInt(config.RequestsPerSecond),
        UseStatisicalDistribution: parseBool(config.UseStatisicalDistribution),
        headers: headersObject,
      },
      endpoints,
    };

    sendMessage(JSON.stringify(message));
  };

  const calcAverage = (c: number, avg: number, last: number): number => {
    return Math.floor((avg * (c - 1) + last) / c);
  };

  const updateChartData = (data: any[]) => {
    const requestsToDisplay = parseInt(config.DurationInSeconds) * 3;

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
    if(message.metrics) {
        setResults(message.metrics);
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
        },
      ]);
    } else {
      const updatedMessages: {
        endpoint: string;
        counter: number;
        duration: number;
      }[] = [...messages];

      updatedMessages[index].counter += 1;
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
      <header>
        <div className="mx-auto max-w-7xl my-10">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Run API Load Test
          </h1>
          <p className="text-lg text-gray-600">Test ID: {params.id}</p>
        </div>
      </header>
      <div>
        <SecondaryButton label="Back" onClick={() => navigate("/")} />
      </div>
      <p className="dark:text-white">Ready state: {readyState}</p>
      <PrimaryButton label="Start Test" onClick={handleClickSendMessage} />
      <div className="dark:text-white">
        <table>
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Counter</th>
              <th>Reponse Time</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message, index) => (
              <tr key={index}>
                <td>{message.endpoint}</td>
                <td>{message.counter}</td>
                <td>{message.duration} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            <div className="grid grid-cols-2 space-x-2">
            <Chart data={chartData} />
            <ResultsTable data={results} />
            </div>
      
    </>
  );
};

export default LoadTest;
