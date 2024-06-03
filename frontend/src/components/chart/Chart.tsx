import { LineChart, Line, XAxis, YAxis } from 'recharts';

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
        <LineChart width={800} height={300} data={data}>

            <Line type="monotone" dataKey="response_time_ms" stroke="#8884d8" />

            <XAxis />
            <YAxis />
        </LineChart>
    )
};

export default Chart;