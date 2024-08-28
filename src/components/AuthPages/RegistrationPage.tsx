import { useState, useEffect } from "react";
import useGlobalContext from "@/functions/GlobalContext";
import { FieldValues } from "@/types/DataTypes";
import { SingleFieldAttributes } from "@/types/FormAttributes";
import { sectionNames } from "@/functions/Constants";

import { Link } from "react-router-dom";
import PasswordField from "../FormFieldComponents/PasswordField";
import TextField from "../FormFieldComponents/TextField";
import SubmitButton from "../BasicButtons/SubmitButton";

function RegistrationPage(){
  useEffect(()=>{
		document.title="Register | Beacon DMS"
	},[]);

	const fieldList:SingleFieldAttributes[] = [
		{category:"single", id:"N", name:"Name", type:"text", required:true},
		{category:"single", id:"E", name:"Email", type:"email", required:true},
		{category:"single", id:"P", name:"Password", type:"password", required:true},
	];
	
	const [fieldValues, setFieldValues] = useState<FieldValues>({});
	
	const [message, setMessage] = useState(<></>);

	const {registerAdmin} = useGlobalContext();

	const handleRegister = async () => {
		for (let i=0; i<Object.keys(fieldValues).length; i++){
			const field = Object.keys(fieldValues)[i]
			if (!fieldValues[field] || fieldValues[field]==""){
				setMessage(<p className="text-red-600">{fieldValues[field].name} is required</p>);
				return;
			}
		}

		const defaultPermissions:FieldValues={}
		Object.values(sectionNames).map(section=>defaultPermissions[section]=["access", "add", "edit","view","delete"]);
		defaultPermissions["team"].push("select")
		defaultPermissions["transaction"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["compliance"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["covenants"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["precedent"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["subsequent"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}

		defaultPermissions["payment"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}

		console.log("SEND PERMISSIONS",defaultPermissions);
		const data = {
			...fieldValues,
			MU: 1,
			R: "Admin",
			Z: "West",
			M: true,
			RM: "root",
			UP:defaultPermissions
		}
		//console.log("data",data)

		const res =  await registerAdmin(data);
		if (res==200)
			setMessage(<div className="text-center"> <span className="text-green-600">Admin successfully created.</span> <Link to="/login" className="text-blue-500 underline decoration-solid	">Go to login page.</Link></div>);
		else if (res==422)
			setMessage(<p className="text-red-600">User already exists.</p>);
		else
			setMessage(<p className="text-red-600">Something Went Wrong.</p>);
			
		return;
	}

	return (
		<div style={{margin:"auto", width:"425px", marginTop:"150px", padding:"20px", borderWidth:"1px", borderColor:"blueviolet", borderRadius:"9px"}}>
			<p className="text-2xl font-bold">Admin Registration Page</p>
			<br/>
			<form>
				{fieldList.map((field,index)=>{
					if (field.type=="password")
						return <PasswordField key={index} index={index} fieldData={field} size="small" prefillValues={fieldValues} setPrefillValues={setFieldValues} disabled={false} />
					else
						return <TextField key={index} index={index} fieldData={field} size="small" padding={2} prefillValues={fieldValues} setPrefillValues={setFieldValues} disabled={false} />
				})}
				<br />
				<SubmitButton submitFunction={handleRegister} submitButtonText="Register" />
			</form>
			<br/>
			
			{message}
		</div>
	)
}

export default RegistrationPage;