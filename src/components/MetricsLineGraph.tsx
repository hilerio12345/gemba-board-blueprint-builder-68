
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
  BarChart,
  Legend
} from "recharts";

interface MetricsLineGraphProps {
  category: string;
  data: { day: string; value: number }[] | { category: string; data: { day: string; value: number }[]; color: string }[];
  color: string;
  graphType?: 'line' | 'bar';
  graphView?: 'weekly' | 'monthly';
  showAllCategories?: boolean;
}

const MetricsLineGraph = ({ 
  category, 
  data, 
  color,
  graphType = 'line',
  graphView = 'weekly',
  showAllCategories = false
}: MetricsLineGraphProps) => {
  // Handle different data formats
  const isMultiCategory = showAllCategories && Array.isArray(data) && data.length > 0 && 'category' in data[0];
  
  // Prepare data for multi-category view
  const chartData = isMultiCategory 
    ? (data as { category: string; data: { day: string; value: number }[]; color: string }[])[0]?.data?.map((item, index) => {
        const dayData: any = { day: item.day };
        (data as { category: string; data: { day: string; value: number }[]; color: string }[]).forEach(categoryData => {
          dayData[categoryData.category] = categoryData.data[index]?.value || 0;
        });
        return dayData;
      }) || []
    : (data as { day: string; value: number }[]);

  // Ensure we have valid data by providing a fallback
  const safeData = chartData && chartData.length > 0 ? chartData : graphView === 'weekly' ? [
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

  const categoryColors = {
    AVAILABILITY: "#0EA5E9",
    DELIVERY: "#8B5CF6", 
    QUALITY: "#10B981",
    COST: "#F97316",
    PEOPLE: "#6E59A5"
  };

  return (
    <div className="h-64 w-full">
      <h3 className="text-sm font-medium mb-2">{category} Trend ({graphView} view)</h3>
      <div className="h-56 w-full border rounded p-2 bg-white">
        <ResponsiveContainer width="100%" height="100%">
          {graphType === 'line' ? (
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
                        <p className="font-medium">{`${label}`}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.dataKey}: ${entry.value}`}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {isMultiCategory && (
                <Legend />
              )}
              {isMultiCategory ? (
                // Render multiple lines for all categories
                Object.keys(categoryColors).map((cat) => (
                  <Line 
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    stroke={categoryColors[cat as keyof typeof categoryColors]}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    name={cat}
                    isAnimationActive={true}
                  />
                ))
              ) : (
                <Line 
                  type="monotone"
                  dataKey="value" 
                  stroke={color}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="Value"
                  isAnimationActive={true}
                />
              )}
            </LineChart>
          ) : (
            <BarChart
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
              <Bar 
                dataKey="value" 
                fill={color}
                name="Value"
                isAnimationActive={true}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsLineGraph;
