

/* import { PieChart } from '@mui/x-charts/PieChart';
import 'react-circular-progressbar/dist/styles.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { KanbanBoard } from "./UnusedComponents/KanbanBoard";
import { LineChart } from "@mui/x-charts";
import { useState } from 'react';

type ZoneList = {
	[key:string]:{
		in_progress:number, 
		completed:number,
		not_started:number,
	}
} */

function Dashboard(props:{label:string}) {
	//return <DashboardComponent />
	return <p>{props.label}</p>
}


export default Dashboard