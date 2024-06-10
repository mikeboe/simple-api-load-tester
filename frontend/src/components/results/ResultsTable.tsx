import { Card, Headline3, ValueDisplay } from "@rcktsftwr/components";

type ResultsTableProps = {
  data: {
    actual_requests_per_sec: number;
    average_response_time: number;
    endpoint_stats: {
      [key: string]: {
        Count: number;
        TotalTime: number;
      };
    };
    failed_requests: number;
    failure_rate: number;
    max_response_time: number;
    min_response_time: number;
    requests_per_second: {
      [key: string]: number;
    };
    success_rate: number;
    successful_requests: number;
    total_requests: number;
  };
};

const ResultsTable = ({ data }: ResultsTableProps) => {
  return (
    <Card headline="Results">
      <>{data.total_requests === 0 && <Headline3>No data available</Headline3>}</>
      <>
        {data.total_requests > 0 && (
            <>
            <div>
                <ValueDisplay label="Total Requests" value={data.total_requests} />
                <ValueDisplay label="Successful Requests" value={data.successful_requests} />
                <ValueDisplay label="Failed Requests" value={data.failed_requests} />
                <ValueDisplay label="Success Rate" value={data.success_rate + "%"} />
                <ValueDisplay label="Failure Rate" value={data.failure_rate + "%"} />
                <ValueDisplay label="Requests per second" value={data.actual_requests_per_sec.toFixed(2)} />
                <ValueDisplay label="Average Response Time" value={(data.average_response_time / 1000000).toFixed(2) + "ms"} />
                <ValueDisplay label="Min Response Time" value={(data.min_response_time / 1000000).toFixed(2) + "ms"} />
                <ValueDisplay label="Max Response Time" value={(data.max_response_time / 1000000).toFixed(2) + "ms"} />
            </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th>
                  <span className="sr-only">Endpoint</span>
                  Endpoint
                </th>
                <th>
                  <span className="sr-only">Count</span>
                  Count
                </th>
                <th>
                  <span className="sr-only">Total Time</span>
                  Total Time
                </th>
                <th>
                  <span className="sr-only">Average Time</span>
                  Average Time
                </th>
              </tr>
                {}
            </thead>
          </table>
          </>
        )}
      </>
    </Card>
  );
};

export default ResultsTable;
