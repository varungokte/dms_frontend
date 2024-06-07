import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";

function Dashboard() {
	const [show, setShow] = useState(false);

	const reloadPage = () =>{
		window.location.reload();
	}

	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/>
			<div>
				<div>
					<Dialog>
						<DialogTrigger onClick={()=>{setShow(true)}}>Open</DialogTrigger>
						{show?<FormDialog/>:""}
					</Dialog>
				</div>
				<div><button onClick={reloadPage}>click</button></div>
			</div>
		</div>
		
	)
}

function FormDialog(){
	console.log("A")
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Are you absolutely sure?</DialogTitle>
				<DialogDescription>

				</DialogDescription>
			</DialogHeader>
		</DialogContent>
	)
}

export default Dashboard;