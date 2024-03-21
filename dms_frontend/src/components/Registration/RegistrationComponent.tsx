import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalContext from "../../../GlobalContext";
import { useToast } from "../ui/use-toast";


export const RegistrationComponent = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div>
            <form onSubmit={(e) => handleRegister(e)}>
                <input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="Username"
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}

                />
                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}

                />
                <input type="submit" value="Register" />

            </form>
        </div>
    )
}
