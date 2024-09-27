import { useEffect, useState } from "react";
import moment from "moment";
import { getDashboardData } from "@/apiFunctions/dashboardAPIs";
import { FieldValues } from "@/types/DataTypes";

import CardDataStats from "./DashboardComponents/CardDataStats"
import LineGraph from "./DashboardComponents/LineGraph"
import PieChart from "./DashboardComponents/PieChart";
//import BarGraph from "./DashboardComponents/BarGraph";

function Dashboard(props:{label:string}) {
	useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

	type CardsData = { c1:string|number, c2:string|number, c3:string|number, c4:string|number };

	type LineData = { xLabels:string[], loanCount: {name:"Number of loan Accounts", data:number[]}, amountCount: {name:"Sanctioned Amount", data:number[]} };

	type PieData = { name: string, value:number,color:string }[];

	const [dataType, setDataType] = useState("Loan Count");
	const [cardData, setCardData] = useState<CardsData>();
	const [lineData, setLineData] = useState<LineData>();
	const [pieData, setPieData] = useState<PieData>();

	const getCardData = (obj:FieldValues) => {
		const {totalLoans, totalSanction, totalHold} = obj||{};
		setCardData({
			c1:totalLoans||0,
			c2:totalSanction||0,
			c3:totalHold||0,
			c4:totalSanction||0-totalHold||0
		});
	};

	const getLineData = (arr:{ date:string, total:number, amounts:number }[]) => {
		const dates = [];
		const loans = [];
		const amounts = [];
		
		for (let i=0; i<arr.length; i++){
			const data = arr[i]
			dates.push(data.date)
			loans.push(data.total);
			amounts.push(data.amounts);
		} 

		setLineData({
			xLabels:dates,
			loanCount:{name:"Number of loan Accounts",data:loans},
			amountCount:{name:"Sanctioned Amount", data:amounts},
		})
	};

	const getPieData = (arr:{_id:string, totalStatus:number}[]) => {
		const colors:FieldValues = {
			Preliminary:"#eab308",
			Document:"#3b82f6",
			Live:"#16a34a",
			Hold:"#ea580c",
			Cancel:"#991b1b",
		};
		const data:PieData = []
		for (let i=0; i<arr.length; i++){
			data.push({
				name:arr[i]["_id"], 
				value:arr[i]["totalStatus"], 
				color:colors[arr[i]["_id"]]
			});
		}

		setPieData(data);
	}

	useEffect(()=>{
		getDashboardData().then(res=>{
			console.log("dashboard response",res.data)
			if (res.status==200){
				//if (res.data && res.data.totalLoans && res.data.totalLoans[0])
					getCardData(res.data.totalLoans[0]);
				getLineData(res.data.totalSanctionData.map((val:FieldValues)=>(
					{ date:moment(new Date(val["_id"])).format("DD-MM-yyyy"), total:val["totalSD"], amounts:val["totalSA"] }
				)));
				getPieData(res.data.totalStatus);
			}
		})
	},[]);

	if (!cardData||!lineData||!pieData)
		return;
	
	return (
		<div className="mx-7">
			<p className="font-bold text-xl text-custom-1 my-5">{props.label}</p>
			<div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
					<CardDataStats title="Total Loan Accounts" total={cardData["c1"]}></CardDataStats>
					<CardDataStats title="Total Sanction Amount" total={cardData["c2"]}></CardDataStats>
					<CardDataStats title="Total Hold Amount" total={cardData["c3"]} ></CardDataStats>
					<CardDataStats title="Total Downsell Amount" total={cardData["c4"]}></CardDataStats>
				</div>
			</div>
			<div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
				<LineGraph title="Product Revenue" parameters={[dataType=="Loan Count"?lineData.loanCount:lineData.amountCount]} xAxisLabels={lineData.xLabels||[]} toggleOptions={{type:dataType, setType:setDataType, options:["Loan Count", "Amount"]}}/>
				<PieChart title="Loan Accounts" parameters={pieData} />
			</div>
			<br />
		</div>
	) 
}

export default Dashboard;