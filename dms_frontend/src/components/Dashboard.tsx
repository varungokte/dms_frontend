//import Tree from "react-d3-tree";

import { useEffect } from "react";
import useGlobalContext from "./../../GlobalContext";

function Dashboard() {	
	const {getDecryptedToken} = useGlobalContext();
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
				
			</div>
		</div>
		
	)
}

export default Dashboard;