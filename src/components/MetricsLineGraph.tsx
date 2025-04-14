
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MetricsLineGraphProps {
  category: string;
  data: { day: string; value: number }[];
  color: string;
}

const MetricsLineGraph = ({ category, data, color }: MetricsLineGraphProps) => {
  // Ensure we have valid data by providing a fallback
  const safeData = data && data.length > 0 ? data : [
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
  ];

  return (
    <div className="h-64 w-full">
      <h3 className="text-sm font-medium mb-2">{category} Trend</h3>
      <div className="h-56 w-full border rounded p-2 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={safeData} 
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2 bg-white border rounded shadow-sm">
                      <p className="font-medium">{`Day: ${label}`}</p>
                      <p className="text-sm" style={{ color }}>
                        {`Value: ${payload[0].value}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Value"
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsLineGraph;
