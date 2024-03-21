import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalContext from "../../../GlobalContext";
import { useToast } from "../ui/use-toast";


export const LoginComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const { LoginUser } = useGlobalContext();
    const { toast } = useToast()


    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        const data = {
            email: email,
            password: password
        }
        LoginUser(data)
            .then((res) => {
                console.log(res)
                if (res.data.user) {
                    toast({
                        variant: "default",
                        title: "Login Successfull",
                    })
                } else {
                    toast({
                        variant: "destructive",
                        title: "Something went wrong",
                    })
                }
            }
            )
            .then(() => {
                navigate('/')
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
