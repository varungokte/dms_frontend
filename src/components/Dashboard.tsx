import { useEffect, useState } from "react";
import { getDashboardData } from "@/apiFunctions/dashboardAPIs";
import { IntervalType } from "@/types/DataTypes";
import getPeriodicList from "@/functions/getDateRange";

import CardDataStats from "./DashboardComponents/CardDataStats"
import LineGraph from "./DashboardComponents/LineGraph"
import PieChart from "./DashboardComponents/PieChart";
//import BarGraph from "./DashboardComponents/BarGraph";

function Dashboard(props:{label:string}) {
	useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

	type CardsData = {
		c1:string|number,
		c2:string|number,
		c3:string|number,
		c4:string|number
	}

	const [intervalValues, setIntervalValues] = useState<string[]>([]);
	const [intervalType, setIntervalType] = useState<IntervalType>("monthly");
	const [cardData, setCardData] = useState<CardsData>();

	useEffect(()=>{
		getDashboardData().then(res=>{
			console.log("res",res);
			if (res.status==200){
				let loanCount = 0;
				let sanctionAmount = 0;
				let holdAmount = 0;
				for (let i=0; i<res.data.length; i++){
					loanCount+=res.data[i]["totalLoans"];
					sanctionAmount+=res.data[i]["totalSanction"];
					holdAmount+=res.data[i]["totalHold"];
				}
				setCardData({
					c1:loanCount,
					c2:sanctionAmount,
					c3:holdAmount,
					c4:sanctionAmount-holdAmount
				})
			}
		})
	},[])

	const parametersLineGraphMain = [
		{name: 'Product One',data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45]},
		{name: 'Product Two',data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51]},
		{name: 'Product Three',data: [35, 30, 67, 40, 52, 51, 89, 94, 87, 63, 90, 51]},
	];

	const parametersPieChart = [
		{name:"Preliminary", value:65, color:"#eab308"},
		{name:'Document',value:34, color:"#3b82f6"},
		{name:'Live',value:12, color:"#16a34a"},
		{name:'Hold',value:56, color:"#ea580c"},
		{name:'Cancel',value:26, color:"#991b1b"},
	]

	const [parametersLineGraph,setParametersLineGraph] = useState (parametersLineGraphMain);

	/* const parametersBarGraph = [
		{name: 'Sales',data: [44, 55, 41, 67, 22, 43, 65]},
		{name: 'Revenue',data: [13, 23, 20, 8, 13, 27, 15]},
	]; */
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
	if (!cardData)
		return;
	
	return (
		<div className="mx-7">
			<p className="font-bold text-xl text-custom-1 my-5">{props.label}</p>
			<div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
					<CardDataStats title="Total Loan Accounts" total={cardData["c1"].toString()}></CardDataStats>
					<CardDataStats title="Total Sanction Amount" total={cardData["c2"].toString()}></CardDataStats>
					<CardDataStats title="Total Hold Amount" total={cardData["c3"].toString()} ></CardDataStats>
					<CardDataStats title="Total Downsell Amount" total={cardData["c4"].toString()}></CardDataStats>
				</div>
			</div>
			<div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
				<LineGraph title="Product Revenue" parameters={parametersLineGraph} xAxisLabels={intervalValues||[]} intervalType={intervalType} setIntervalType={setIntervalType} />
				<PieChart title="Loan Accounts" parameters={parametersPieChart} />
				{/* <BarGraph title="Revenue this week" parameters={parametersBarGraph} xAxisLabels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} /> */}
			</div>
			<br />
		</div>
	) 
}

export default Dashboard;