import { FormEvent, useState } from "react";
import useGlobalContext from "../../../GlobalContext";

export const RegistrationPage = () => {
	const [companyName, setCompanyName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [maximumUsers, /* setMaximumUsers */] = useState(1);
	const [zone, /* setZone */] = useState(1);
	const [reportingManager,/* setReportingManager */] = useState("ABC");
	const [message, setMessage] = useState("");

	const {RegisterAdmin} = useGlobalContext()

	const handleRegister = (e: FormEvent) => {
		e.preventDefault();
		const data = {
			E: email,
			N: companyName,
			P: password,
			MU: maximumUsers,
			Z: zone,
			RM: reportingManager,
			UP:{
				"Loan Account": ["access", "view", "delete","add","edit"],
				"Product": ["access", "view", "delete","add","edit"],
				"Transaction Documents": ["access", "view", "delete","add","edit"],
				"Compliance Documents": ["access", "view", "delete","add","edit"],
				"Covenants": ["access", "view", "delete","add","edit"],
			}
		}

		RegisterAdmin(data).then((res:any)=>{
			if (res.status == 409)
				setMessage("Conflict Error");
			else if (res.status == 200)
				setMessage("Successfully created");
		})
		.catch((err:any)=>{
			if (err.status == 409)
				setMessage("Conflict Error")
		})
	}

	return (
		<div className="m-5">
			<p>Register a new User here.</p>
			<br/>
			<label htmlFor="name">Company Name</label>
			<form onSubmit={(e) => handleRegister(e)}>
				<input
					type="text"
					id="name"
					name="name"
					value={companyName}
					placeholder="Username"
					onChange={(e) => setCompanyName(e.target.value)}
				/>

				<br/>
				<br/>
				<label htmlFor="email">Email</label>
				<br/>
				<input
					type="email"
					id="email"
					value={email}
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				
				<br/>
				<br/>
				<label htmlFor="password">Password</label>
				<br/>
				<input
					type="password"
					id="password"
					value={password}
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
				/>

				{/* <br/>
				<br/>
				<label htmlFor="cname">Maximum Users</label>
				<br/>
				<input
					type="number"
					id="max"
					value={maximumUsers}
					onChange={(e:any) => setMaximumUsers(e.target.value)}
				/>
				<br/>
				<br/>
				<label htmlFor="cname">Zone</label>
				<br/>
				<input
					type="number"
					id="z"
					value={zone}
					onChange={(e:any) => setZone(e.target.value)}
				/>
				<br/>
				<br/>
				<label htmlFor="cname">Reporting Manager</label>
				<br/>
				<input
					type="text"
					id="repman"
					value={reportingManager}
					placeholder="Reporting Manager"
					onChange={(e) => setReportingManager(e.target.value)}
				/> */}
				<br/>
				<br/>
				<input type="submit" value="Register" />
			</form>
			<div>{message}</div>
		</div>
	)
}
