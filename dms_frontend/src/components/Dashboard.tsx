import { useEffect } from "react";

function Dashboard(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/><br/>
		</div>
	)
}

export default Dashboard;