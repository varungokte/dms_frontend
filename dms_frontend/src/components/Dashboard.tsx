import { useState, useEffect } from "react";
//import useGlobalContext from "../../GlobalContext";
//import { masters } from "./../../Constants";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { DataTable } from "./BasicComponents/Table";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import Search from "./BasicComponents/Search";

import { PieChart } from '@mui/x-charts/PieChart';
import 'react-circular-progressbar/dist/styles.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { KanbanBoard } from "./UnusedComponents/KanbanBoard";
import { LineChart } from "@mui/x-charts";
import DashboardComponent from "./DashboardComponent/DashboardComponent";

type ZoneList = {
	[key:string]:{
		in_progress:number, 
		completed:number,
		not_started:number,
	}
}

function Dashboard(props:{label:string}) {
	return <DashboardComponent />
	/* useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

	const [zones, setZones] = useState<ZoneList>();

	useEffect(()=>{
		const zoneList = ["-","North","South","East","West"];
		const obj:any={};
		const amounts = [
		{ completed:0, in_progress:200, not_started:80 },
		{ completed: 20, in_progress:38, not_started:21 },
		{ completed: 30, in_progress:20, not_started:80 },
		{ completed: 2, in_progress:10, not_started:1 },
		{ completed: 710, in_progress:1029, not_started:809 },
	];
		zoneList.map((zone:any,index:number)=>{
			if (zone!="-")
				obj[zone] = amounts[index]
		})
		setZones(obj);
	},[]);

	const [currentZone, setCurrentZone] = useState("");

	const [zoneDetails] = useState([
		{ AID:1, CN:"Loan Company", SD:"12/07/2024" },
		{ AID:2,	CN:"Construction Company", SD:"12/07/2024" }
	]);

	const [searchString, setSearchString] = useState("");

	return (
		<div>
			<p className="text-3xl font-bold m-7">
				{currentZone==""
					?<span>Dashboard</span>
					:<span>
						<button onClick={()=>setCurrentZone("")}><ChevronLeftIcon/></button>
						{currentZone}
					</span>
				}
				</p>
			<div className="flex flex-row">
				<div className=''>
				<Search setter={setSearchString} label="Search" className="mx-10 my-3"/>
				</div>
			</div>

			{zones
				?Object.keys(zones).length==0
					?<EmptyPageMessage sectionName="data" />
					:<div className="flex flex-row flex-wrap mx-10">
					{currentZone==""
						?<AllZones zones={zones} searchString={searchString} setter={setCurrentZone} />
						:<SingleZone setter={setCurrentZone} zoneDetails={zoneDetails} />
					}
				</div>
				:<LoadingMessage sectionName="data" />
			}
			<KanbanBoard />
			 <ThisWeekView className="mx-10 w-[200px] " /> 
			<LineChart
				xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
				series={[
					{
						data: [2, 5.5, 2, 8.5, 1.5, 5],
					},
				]}
				width={500}
				height={300}
			/>
		</div>
	) */
};

function AllZones(props:{zones:ZoneList, searchString:string, setter:Function}){
	const [zones] = useState(props.zones);
	
	return(
		Object.keys(zones).map((zone, index)=>{
			const zoneData = zones[zone];
			const regEx = new RegExp(props.searchString, "i");
			if (zone.search(regEx)!==-1)
				return(
					<Card key={index+"c"} style={{width:"45vh", marginRight:"5%", marginBottom:"3%", borderRadius:"20px", backgroundColor:"white"}}>
						<CardHeader>
							<CardTitle>{zone}</CardTitle>
						</CardHeader>
						<CardContent key={index+"c"}>
							<p  className="text-xl">Total Loans: {Object.values(zoneData).reduce((a,c)=>a+c)}</p>
							<div key={index+"cdiv"} className="flex flex-row ">
								<PieChart
									series={[{data:[{ id: 0, value: zoneData.completed, label: 'Completed' },
										{ id: 1, value: zoneData.in_progress, label: 'In Progress' },
										{ id: 2, value: zoneData.not_started, label: 'Not Started' },
									]}]}
									width={400}
									height={200}
								/>
							</div>
						</CardContent>
						<CardFooter>	
							<button className="text-custom-1 m-auto" onClick={()=>{props.setter(zone);}}>View Loans {`->`}</button>	
						</CardFooter>
					</Card>
				)
	}))
};

function SingleZone(props:any){
	return(
		<DataTable 
			headingRows = {["Agreement ID", "Deal Name", "Sanction Date"]}
			headingClassNames={["w-[100px","",""]} 
			tableData={props.zoneDetails} columnIDs={["AID", "CN","SD"]} 
			cellClassName={["font-medium","","","text-right"]} dataTypes={["text", "text", "text", "text"]} 
		/>
	)
}

export default Dashboard;