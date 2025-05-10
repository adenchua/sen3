import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PRIMARY_COLOR } from "../../constants/styling";

type DataPoint = {
  name: string;
} & Record<string, unknown>;

interface IProps {
  data: Array<DataPoint>;
  lineKeys: string[];
  height?: number;
  width?: number;
}

export default function LineChart(props: IProps) {
  const { data, lineKeys, height = 300, width = "100%" } = props;

  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartsLineChart data={data} margin={{ bottom: 30, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" align="center" />
        {lineKeys.map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={PRIMARY_COLOR}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
