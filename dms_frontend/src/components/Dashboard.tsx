import { useEffect, useState } from "react";
import { ZoneList } from "./../../Constants";

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";

import { PieChart } from '@mui/x-charts/PieChart';

function Dashboard(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);
	//["January", "February","March","April","May","June","July","August","September","October","November","December"]
	const [zones, setZones] = useState<string[]>();

	useEffect(()=>{
		console.log("ZoneList",ZoneList)
		setZones(ZoneList);
	},[])
  
	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/>
			<br/>
			{zones
				?zones.length==0
					?zones.map(zone=>{
						return (
							<Card sx={{width:"30%"}}>
								<CardContent>
									<Typography variant="h5" component="div">{zone}</Typography>
								</CardContent>
							</Card>
						)
					})
					:<EmptyPageMessage sectionName="data" />
				:<LoadingMessage sectionName="data" />
			}
			<PieChart
				series={[
					{
						data: [
							{ id: 0, value: 10, label: 'series A' },
							{ id: 1, value: 15, label: 'series B' },
							{ id: 2, value: 20, label: 'series C' },
						],
					},
				]}
				width={400}
				height={200}
			/>
		</div>
	)
}

export default Dashboard;