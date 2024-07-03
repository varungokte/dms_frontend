import { useEffect, /* useState */ } from "react";

function Dashboard(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

	//const [value, setValue] = useState(1234567.10);

	//useEffect(()=>console.log("number",value),[value])

	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/><br/>
			{/* <input className="m-28" 
				value={new Intl.NumberFormat("en-IN").format(value)}
				onChange={(e)=>{
					const val_w_commas=e.target.value;
					console.log("pre val",val_w_commas);
					let val="";
					for (let i=0; i<val_w_commas.length; i++){
						console.log("value value",value.toString(),value.toString().search("."))
						if (val_w_commas[i]=="." && value.toString().search(".")==-1)
							val+=val_w_commas[i]+"1"
						else if (!isNaN(Number(val_w_commas[i])))
							val+=val_w_commas[i];
					}
					console.log("new curr",val)
					setValue(Number(val))
				}} 
			/> */}
		</div>
	)
}

export default Dashboard;