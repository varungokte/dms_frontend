import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalContext from "../../../GlobalContext";
import { useToast } from "../ui/use-toast";


export const RegistrationComponent = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("")
	const navigate = useNavigate()
	const { RegisterUser } = useGlobalContext();
	const { toast } = useToast()


	const handleRegister = (e: FormEvent) => {
		e.preventDefault();
		const data = {
			name: name,
			email: email,
			password: password
		}
		RegisterUser(data)
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
			})
	}

	return (
		<div className="m-5">
			<p>Register a new User here.</p>
			<br/>
			<label htmlFor="name">Name</label>
			<form onSubmit={(e) => handleRegister(e)}>
			<input
				type="text"
				id="name"
				name="name"
				value={name}
				placeholder="Username"
				onChange={(e) => setName(e.target.value)}
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
			<label htmlFor="role">Role</label>
			<br/>
			<input
				type="text"
				id="role"
				value={role}
				placeholder="Role"
				onChange={(e) => setRole(e.target.value)}
			/>
			<br/>
			<br/>
			<input type="submit" value="Register" />
			</form>
		</div>
	)
}
