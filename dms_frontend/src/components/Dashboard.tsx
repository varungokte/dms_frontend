import { Link } from "react-router-dom";
//import Combobox from "./BasicComponents/Combobox";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { Autocomplete, TextField } from "@mui/material";

function Dashboard() {
	const [results, setResults] = useState<any>([]);
	const [value, setValue] = useState("");
	const [options] = useState([
		{ label: "Kal-El (Superman)", values:{N:"Kal-El", R:"Superman"} },
		{ label: "Bruce Wayne (Batman)", values:{N:"Bruce Wayne", R:"Batman"} },
		{ label: "Dick Grayson (Nightwing)", values:{N:"Dick Grayson", R:"Nightwing"} },
		{ label: "Kara Danvers (Supergirl)", values:{N:"Kara Danvers", R:"Supergirl"} },
		{ label: `User1 <email@email>`, values:{N:"User1", E:"email@email"}}
	]);

	useEffect(()=>{
		console.log("value", results);
	},[results]);


	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/>
			<div>
				<div><Button variant="contained">Hello There</Button></div>
				<div>
					<Link to="view/data.pdf">GO </Link>	
				</div>
				<div>
					<Autocomplete 
						onChange={(event,temp)=>setResults(temp)} 
						multiple options={options} 
						getOptionLabel={(option)=>option.label} 
						filterOptions={(optionsList)=>{
							if (value=="")
								return optionsList;

							const newOptionsList:any = []; 
							const regEx = new RegExp(value, "i");
							for (let i=0; i<optionsList.length; i++){
								let found = false;
								const values=Object.values(optionsList[i].values);
								console.log("value array",values);
								for (let j=0; j<values.length; j++){
									console.log("spec value", values[j]);
									if (values[j].search(regEx)!==-1) 
										found = true;
								}
								if (found){
									newOptionsList.push(optionsList[i]);
									console.log("adding",optionsList[i]);
								}
							}
							return newOptionsList;
						}}
						renderInput={(props)=><TextField {...props} value={value} onChange={(e)=>{setValue(e.target.value)}} label="Select Users" placeholder="Team Members" />} 
						/>
				</div>
				{/* <div><Combobox label="user" options={options} value={value} setValue={setValue} /> </div> */}
			</div>
		</div>
		
	)
}

export default Dashboard;