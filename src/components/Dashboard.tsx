import getPeriodicList from "@/functions/getDateRange";
import BarGraph from "./DashboardComponents/BarGraph";
import CardDataStats from "./DashboardComponents/CardDataStats"
import LineGraph from "./DashboardComponents/LineGraph"
import PieChart from "./DashboardComponents/PieChart";
import { useEffect, useState } from "react";
import { IntervalType } from "@/types/DataTypes";

function Dashboard(props:{label:string}) {
	useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);
	
	const [intervalValues, setIntervalValues] = useState<string[]>();
	const [intervalType, setIntervalType] = useState<IntervalType>("monthly");

	const parametersLineGraphMain = [
		{name: 'Product One',data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45]},
		{name: 'Product Two',data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51]},
	];

	const parametersPieChart = [
		{name:"Desktop", value:65},
		{name:'Tablet',value:34},
		{name:'Mobile',value:12},
		{name:'Unknown',value:56},
	]

	const [parametersLineGraph,setParametersLineGraph] = useState (parametersLineGraphMain);

	const parametersBarGraph = [
		{name: 'Sales',data: [44, 55, 41, 67, 22, 43, 65]},
		{name: 'Revenue',data: [13, 23, 20, 8, 13, 27, 15]},
	];
	const getDateRange = () => {
		const values = getPeriodicList(intervalType, new Date("10/25/23"), new Date());
		setIntervalValues(values);
		const intervalLength = values.length;
		const arr = parametersLineGraphMain.map(val=>{
			const newData = val.data.slice(0,intervalLength);
			return {name:val.name,data:newData};
		})
		setParametersLineGraph(arr);
	}
	useEffect(()=>getDateRange(),[intervalType])
	return (
		<div className="mx-7">
			<p className="font-bold text-xl text-custom-1 my-5">{props.label}</p>
			<div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
					<CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp></CardDataStats>
					<CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp></CardDataStats>
					<CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp></CardDataStats>
					<CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown></CardDataStats>
				</div>
			</div>
			<div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
				<LineGraph title="Product Revenue" parameters={parametersLineGraph} xAxisLabels={intervalValues||[]} intervalType={intervalType} setIntervalType={setIntervalType} />
				<BarGraph title="Revenue this week" parameters={parametersBarGraph} xAxisLabels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} />
				<PieChart title="Device Share" parameters={parametersPieChart} />
			</div>
			<br />
		</div>
	) 
}

export default Dashboard;




