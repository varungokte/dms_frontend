import { useEffect, useState } from "react";
import ComboboxField from "@/components/FormFieldComponents/ComboboxField";
import { FieldValues, UserSuggestionsList } from "@/types/DataTypes";
import { getDocSecList } from "@/functions/sectionNameAttributes";
import { getUserDealsList } from "@/apiFunctions/dealsListAPIs";
import { getUserSuggestions } from "@/apiFunctions/suggestionAPIs";

import SendIcon from '@mui/icons-material/Send';
import Button from "@mui/material/Button";
import SelectField from "@/components/FormFieldComponents/SelectField";
import DealsList from "@/components/DealsList";

function UserAssignments(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const docSections = {
    labels: ["-"].concat(getDocSecList("fullname")),
    values: ["-"].concat(getDocSecList("keyname"))
  }

  const [users, setUsers] = useState<UserSuggestionsList>();
  const [fieldValues, setFieldValues] = useState<FieldValues>({});

  const [userEmail, setUserEmail] = useState<string>();
  const [sectionName, setSectionName] = useState<string>();

  const [docData, setDocData] = useState<FieldValues>();
  
  const getData = async () => {
    const res = await getUserDealsList({userEmail:userEmail||"", sectionName:docSections.values[docSections.labels.indexOf(sectionName||"")]});
    setDocData(res);
  }

  useEffect(()=>{
    getUserSuggestions("AU").then(res=>{
      const arr = res.obj.map((sugg:any)=>{
        const temp={
          label:sugg["N"]+`<${sugg["E"]}>`,
          values:sugg
        };
        return temp;
      });
      setUsers(arr);
    })
  },[]);
  
  useEffect(()=>{
    if (!fieldValues)
      return;
    if (fieldValues["user"] && fieldValues["user"].values && fieldValues["user"].values["E"])
      setUserEmail(fieldValues["user"].values["E"]);
    if (fieldValues["section"])
      setSectionName(fieldValues["section"]);
  },[fieldValues]);

  useEffect(()=>console.log("fieldvalues",fieldValues),[fieldValues]);

  if (!users || users.length==0)
    return<></>;

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
      <br />
      <div className="w-[50%] flex flex-row mx-7">
        <div className="flex-auto">
          <ComboboxField index={0} 
            fieldData={{id:"user",name:"Select a user", type:"combobox",placeholder:"Search by user name or email"}} 
            suggestions={users}
            fieldValue={fieldValues["user"]} setFieldValues={setFieldValues} disabled={false}
          />
        </div>
        <SelectField index={1}
          fieldData={{id:"section",name:"Section Name", type:"select",options:docSections.labels, required:true}}
          fieldValue={fieldValues["section"]} setFieldValues={setFieldValues} disabled={false}
        />
        <Button variant="contained" color="secondary" sx={{height:"55px", margin:"auto"}} disabled={!(fieldValues["user"]&&fieldValues["section"])} onClick={getData}><SendIcon/></Button>
      </div>
      <br />
      <div className="">
        {docData?<DealsList label={sectionName||"Transaction Documents"} docData={docData} specType="assign" />:<></>}
      </div>
    </div>
  )
}

export default UserAssignments;