import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { orange } from "@mui/material/colors";

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
            stroke={orange[800]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
