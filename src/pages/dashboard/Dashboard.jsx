import { FaLeaf, FaExclamationTriangle, FaSeedling } from "react-icons/fa";
import CardStat from "../../components/CardStat";
import DonutChart from "../../components/DonutChart";
import BarChart from "../../components/BarChart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardStat icon={<FaLeaf className="text-green-600" />} value="100" label="Total Pohon" color="border-green-400" />
        <CardStat icon={<FaExclamationTriangle className="text-red-500" />} value="5" label="Pohon Sakit" color="border-red-400" />
        <CardStat icon={<FaSeedling className="text-blue-600" />} value="30" label="Siap Panen" color="border-blue-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DonutChart />
        <BarChart />
      </div>
    </div>
  );
}
