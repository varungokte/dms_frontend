//import Tree from "react-d3-tree";

import { useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import DashboardTest from "./DashboardTest";


function Dashboard() {	
	const {getDecryptedToken} = useGlobalContext();
	const [test,setTest] = useState(<></>)
	useEffect(()=>{
		getDecryptedToken().then(res=>{
			console.log(res);
		})
	},[])
	/* const orgChart = {
		name: "Emperor Palpatine",
		children: [
			{
				name: "Darth Vader",
				attributes: {
					department: "Sith"
				},
				children: [
					{
						name: "Grand Inquisitor"
					}
				]
			},
			{
				name: "Wilhuff Tarkin"
			}
		]
	} */
	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/>
			<div>
				<div >
				{/* <Tree data={orgChart} draggable={false} zoomable={false} dimensions={{height:100000, width:1000000}} /> */}
				</div>

				<div>
				<button onClick={()=>setTest(<DashboardTest/>)}>Run DashboardTest</button>
				{test}
				</div>
			</div>
		</div>
		
	)
}

export default Dashboard;