import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import { FieldValues } from "@/types/DataTypes";
import { SingleFieldAttributes } from "@/types/FormAttributes";
import { loginUser } from "@/apiFunctions/authAPIs";

import login_img from "@/static/login_img.png";
import TextField from "../FormFieldComponents/TextField";
import PasswordField from "../FormFieldComponents/PasswordField";
import SubmitButton from "../BasicButtons/SubmitButton";

function LoginPage() {
  useEffect(()=>{
		document.title="Login | Beacon DMS"
	},[]);

  const fieldList:SingleFieldAttributes[] =[
    {category:"single", id:"E", name:"Email", type:"email", required:true},
    {category:"single", id:"P", name:"Password", type:"password", required:true}
  ];

  const [fieldValues, setFieldValues] = useState<FieldValues>({});

  const [errorMessage, setErrorMessage] = useState(<></>);

	const navigate = useNavigate();

	const submitData = async () => {

		if (!fieldValues["E"] || fieldValues["E"]===""){
      setErrorMessage(<p className="text-red-600">Email is required</p>);
      return;
    }
    if (!fieldValues["P"] || fieldValues["P"]===""){
      setErrorMessage(<p className="text-red-600">Password is required</p>);
      return;
    }

    //console.log('sending fieldvalues',fieldValues);
		const res = await loginUser(fieldValues);
    //console.log("RESPONSE",res);
    
    if (res==200)
      navigate('/');
    else if (res==401 || res==412)
      setErrorMessage(<p className="text-red-600">Incorrect Username or Password</p>);
    else if (res==409)
      setErrorMessage(<p className="text-red-600">Inactive User. Contact your administrator.</p>);
    else
      setErrorMessage(<p className="text-red-600">Something went wrong.</p>);
    return;
	}

	return (		
    <div className="flex flex-row">
      <div style={{marginTop:"3%",}}>
        <img src={login_img} width={"80%"} style={{float:"right", paddingRight:"5%"}}/>
      </div>
      <div className="m-3" style={{marginTop:"7%", marginLeft:"5%", width:"35%"}}>
        <p className="text-4xl font-bold mb-7 mx-12" style={{color:"slateblue"}}>Welcome!</p>
        <form>
          <TextField index={0} fieldData={fieldList[0]} size="medium" fieldValue={fieldValues[fieldList[0].id]} setFieldValues={setFieldValues} disabled={false} />
          <PasswordField index={1} fieldData={fieldList[1]} fieldValue={fieldValues[fieldList[1].id]} size="medium" setFieldValues={setFieldValues} disabled={false} />
          {errorMessage}
          <br/>
          <SubmitButton width="100%" submitFunction={submitData} submitButtonText={"Log in"} />
        </form>
      </div>
    </div>
	)
}

export default LoginPage