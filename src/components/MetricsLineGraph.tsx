
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
  Bar,
  BarChart
} from "recharts";

interface MetricsLineGraphProps {
  category: string;
  data: { day: string; value: number }[];
  color: string;
  graphType?: 'line' | 'bar';
  graphView?: 'weekly' | 'monthly';
}

const MetricsLineGraph = ({ 
  category, 
  data, 
  color,
  graphType = 'line',
  graphView = 'weekly'
}: MetricsLineGraphProps) => {
  // Ensure we have valid data by providing a fallback
  const safeData = data && data.length > 0 ? data : graphView === 'weekly' ? [
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
  ] : [
    { day: "Week 1", value: 0 },
    { day: "Week 2", value: 0 },
    { day: "Week 3", value: 0 },
    { day: "Week 4", value: 0 },
  ];

  const ChartComponent = graphType === 'line' ? LineChart : BarChart;
  const DataComponent = graphType === 'line' ? Line : Bar;

  return (
    <div className="h-64 w-full">
      <h3 className="text-sm font-medium mb-2">{category} Trend ({graphView} view)</h3>
      <div className="h-56 w-full border rounded p-2 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent 
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
                      <p className="font-medium">{`${label}`}</p>
                      <p className="text-sm" style={{ color }}>
                        {`Value: ${payload[0].value}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <DataComponent 
              type={graphType === 'line' ? "monotone" : undefined}
              dataKey="value" 
              fill={color}
              stroke={color}
              strokeWidth={graphType === 'line' ? 2 : 0}
              activeDot={{ r: 6 }}
              name="Value"
              isAnimationActive={true}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsLineGraph;
