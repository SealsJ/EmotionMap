import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface EmotionBarChartProps {
  barData: { emotion: string; seconds: number }[];
  emotionColors: Record<string, string>;
}

export default function EmotionBarChart ({ barData, emotionColors }: EmotionBarChartProps) {
  return (
    <div className="w-full flex flex-col items-center pt-3 h-full">
      <div className="w-full h-[18vh] min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData}>
          <XAxis 
            dataKey="emotion" 
            stroke="#FFFFFF" 
            tick={{ fill: "#FFFFFF" }} 
          />
          <YAxis
            label={{
              value: "Seconds (s)",
              angle: -90,
              position: "insideLeft",
              fill: "#FFFFFF",
              dy: 55
            }}
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF" }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#FFFFFF", border: "none", borderRadius: '12px' }}
            labelStyle={{ color: "#5d1283" }}
            itemStyle={{ color: "#5d1283" }}
          />
          <Bar dataKey="seconds">
            {barData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={emotionColors[entry.emotion] || "#FFFFFF"}
          />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
      <h3 className="text-lg md:text-xl text-white font-semibold mb-2">Total Video Emotion Duration</h3>
    </div>
  );
};