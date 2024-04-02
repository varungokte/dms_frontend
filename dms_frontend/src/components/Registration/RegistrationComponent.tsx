import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalContext from "../../../GlobalContext";
import { useToast } from "../ui/use-toast";


export const RegistrationComponent = () => {
	const [companyName, setCompanyName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [totalUsers, setTotalUsers] = useState(0);
	const [maximumUsers, setMaximumUsers] = useState(0);
	const [message, setMessage] = useState("");

	const navigate = useNavigate()
	const { RegisterUser } = useGlobalContext();
	const { toast } = useToast()


	const handleRegister = (e: FormEvent) => {
		e.preventDefault();
		const data = {
			E: email,
			CN: companyName,
			P: password,
			TU: totalUsers,
			MU: maximumUsers
		}

		console.log(JSON.stringify(data))

		fetch("http://192.168.1.2:3000/api/v1/allAPI/addAdmin",{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(data)
		})
		.then((res:any)=>{
			if (res.status == 409)
				setMessage("Conflict Error");
			else if (res.status == 200)
				setMessage("Successfully created");
		})
		.catch((err:any)=>{
			if (err.status == 409)
				setMessage("Conflict Error")
		})

		/* RegisterUser(data)
			.then(() => toast({
				variant: "default",
				title: "Registration Successfull",
				description: "now you can login"
			}))
			.then(() => {
				navigate('/login');
			})
			.catch((err) => {
				toast({
					variant: "default",
					title: "Error",
					description: err.message
				})
			}) */
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

				<br/>
				<br/>
				<label htmlFor="role">Total Users</label>
				<br/>
				<input
					type="number"
					id="total"
					value={totalUsers}
					onChange={(e:any) => setTotalUsers(e.target.value)}
				/>
				<br/>
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
				<input type="submit" value="Register" />
			</form>
			<div>{message}</div>
		</div>
	)
}
