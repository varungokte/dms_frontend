import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FieldValues } from "@/types/DataTypes";
import { SingleFieldAttributes } from "@/types/FormAttributes";
import giveAllPermissions from "@/functions/giveAllPermissions";

import { registerAdmin } from "@/apiFunctions/authAPIs";

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

	const handleRegister = async () => {
		for (let i=0; i<Object.keys(fieldValues).length; i++){
			const field = Object.keys(fieldValues)[i]
			if (!fieldValues[field] || fieldValues[field]==""){
				setMessage(<p className="text-red-600">{fieldValues[field].name} is required</p>);
				return;
			}
		}

		const data = {
			...fieldValues,
			MU: 1,
			R: "Admin",
			Z: "West",
			M: true,
			RM: "root",
			UP: giveAllPermissions(),
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
						return <PasswordField key={index} index={index} fieldData={field} size="small" fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} disabled={false} />
					else
						return <TextField key={index} index={index} fieldData={field} size="small" padding={2} fieldValue={fieldValues[field.id]} setFieldValues={setFieldValues} disabled={false} />
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