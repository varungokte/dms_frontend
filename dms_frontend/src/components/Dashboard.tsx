//import Tree from "react-d3-tree";

import { useEffect, useState } from "react";
//import useGlobalContext from "./../../GlobalContext";
import DashboardTest from "./DashboardTest";


function Dashboard() {	
	//const { getSingleDocument} = useGlobalContext();
	const [test,setTest] = useState(<></>);
	useEffect(()=>{
		/* getSingleDocument("rZMwppzO2",TransactionDocumentTypes[4],"1716459086326-data2.pdf").then(res=>{
			console.log("the response here:",res);
		}) */
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