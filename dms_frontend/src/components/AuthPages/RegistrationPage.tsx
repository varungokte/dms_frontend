import { FormEvent, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";

export const RegistrationPage = () => {
	const [companyName, setCompanyName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [maximumUsers, /* setMaximumUsers */] = useState(1);
	const [zone, /* setZone */] = useState("West");
	const [reportingManager,/* setReportingManager */] = useState("ABC");
	const [isManager, /* setIsManager */]  = useState(true);
	const [message, setMessage] = useState(<></>);

	const {RegisterAdmin} = useGlobalContext();

	const handleRegister = (e: FormEvent) => {
		e.preventDefault();
		if (companyName==""||email==""||password==""){
			setMessage(<p className="text-red-600">All fields must be filled.</p>);
			return;
		}
		const data = {
			E: email,
			N: companyName,
			P: password,
			MU: maximumUsers,
			Z: zone,
			M: isManager,
			RM: reportingManager,
			UP:JSON.stringify({
				"Loan Account": ["access", "view", "delete","add","edit"],
				"Product": ["access", "view", "delete","add","edit"],
				"Transaction Documents": ["access", "view", "delete","add","edit"],
				"Compliance Documents": ["access", "view", "delete","add","edit"],
				"Covenants": ["access", "view", "delete","add","edit"],
			})
		}

		setMessage(<LinearProgress />)

		RegisterAdmin(data).then((res:any)=>{
			if (res==200)
				setMessage(<div className="text-center"> <span className="text-green-600">Admin successfully created.</span> <Link to="/login" className="text-blue-500 underline decoration-solid	">Go to login page.</Link></div>);
			else if (res==422)
				setMessage(<p className="text-red-600">User already exists.</p>);
			else
				setMessage(<p className="text-red-600">Something Went Wrong.</p>);
		})
		.catch(()=>{
			setMessage(<p className="text-red-600">Something Went Wrong.</p>);
		})
	}

	return (
		<div style={{margin:"auto", width:"425px", marginTop:"150px", padding:"20px", borderWidth:"1px", borderColor:"blueviolet", borderRadius:"9px"}}>
			<p className="text-2xl font-bold">Admin Registration Page</p>
			<br/>
			<form onSubmit={(e)=>handleRegister(e)}>
				<label htmlFor="name" className="my-1">Username <span className="text-red-600">*</span></label>
				<br/>
				<input type="text" id="name" name="name" className="p-2 rounded-if w-full" value={companyName} placeholder="Username" onChange={(e)=>setCompanyName(e.target.value)} />
				<br/><br/>
				
				<label htmlFor="email">Email <span className="text-red-600">*</span></label>
				<br/>
				<input type="email" id="email" className="p-2 rounded-if w-full" value={email} placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />	
				<br/><br/>
				
				<label htmlFor="password">Password <span className="text-red-600">*</span></label>
				<br/>
				<input type="password" id="password" className="p-2 rounded-if  w-full" value={password} placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
				<br/><br/>

				{/*
					<label htmlFor="cname">Maximum Users</label>
					<br/>
					<input type="number" id="max" value={maximumUsers} onChange={(e:any)=>setMaximumUsers(e.target.value)} />
					<br/><br/>
					
					<label htmlFor="cname">Zone</label>
					<br/>
					<input type="number" id="z" value={zone} onChange={(e:any) => setZone(e.target.value)} />
					<br/><br/>
					
					<label htmlFor="cname">Reporting Manager</label>
					<br/>
					<input id="repman" type="text" value={reportingManager} placeholder="Reporting Manager" onChange={(e) => setReportingManager(e.target.value)} /> 
					<br/><br/>
				*/}
				<button type="submit" className="bg-custom-1 p-2 rounded-if text-white  w-full" value="Register">Register</button>
			</form>
			<br/>
			
			{message}
		</div>
	)
}
