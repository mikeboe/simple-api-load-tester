import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card } from "@rcktsftwr/components";

interface ChartProps {
  data?: any[];
}

const Chart = ({ data }: ChartProps) => {
  /*   function getMax(data: [], key: string) {
          let max = 0;
          data.forEach((item) => {
              if (item[key] > max) {
                  max = parseInt(item[key]);
              }
          });
          console.log(max);
          return parseInt(max) + 1;
      } */

  return (
    <Card headline="Response time">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart width={800} height={300} data={data}>
          <Line type="monotone" dataKey="response_time_ms" stroke="#8884d8" />

          <XAxis />
          <YAxis />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
