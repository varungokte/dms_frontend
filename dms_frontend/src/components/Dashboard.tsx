import { useEffect, useState } from "react";
import useGlobalContext from "../../GlobalContext";
import { ComboboxField } from "./FormComponents/FormFields";

function Dashboard() {
	const {getDecryptedToken} = useGlobalContext();
	
	const [fieldValues, setFieldValues] = useState<any>({});

	const showToken = async () => {
		const res = await getDecryptedToken();
		console.log("Res",res);
	}

	const [suggestions] = useState([
		{label: "James Kirk - Enterprise", values:{E:"James Kirk", S:"Enterprise"}},
		{label: "Jean-Luc Picard - Enterprise-D", values:{E:"Jean-Luc Picard",S:"Enterprise-D"}},
		{label: "Benjamin Sisko - Defiant", values:{E:"Benjamin Sisko",S:"Defiant"}},
		{label: "Kathryn Janeway - Voyager", values:{E:"Kathryn Janeway",S:"Voyager"}},
		{label: "William Riker - Hood", values:{E:"William Riker",S:"Hood"}}
	])

	useEffect(()=>{
		console.log("FIELD VALUES",fieldValues)
	},[fieldValues])

	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/>
			<div>
				<div><button onClick={showToken}>click</button></div>
			</div>
			<br/>
			<div>
				<ComboboxField index={1} id="A" name="test" required disabled={false} multiple
				prefillValues={fieldValues} setPrefillValues={setFieldValues} suggestions={suggestions} 
				/>
			</div>
		</div>
		
	)
}

export default Dashboard;