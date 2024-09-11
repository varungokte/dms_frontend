import { useEffect, useState } from "react";
import { getUserSuggestions } from "@/apiFunctions/suggestionAPIs";
import { FieldValues, UserSuggestionsList } from "@/types/DataTypes";

import ComboboxField from "./FormFieldComponents/ComboboxField";
import Button from "@mui/material/Button/Button";
import SendIcon from '@mui/icons-material/Send';
import { DataTable } from "./BasicTables/Table";

function TeamTransfer(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [users, setUsers] = useState<UserSuggestionsList>();

  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [teamList, setTeamList] = useState<FieldValues[]>();
  
  useEffect(()=>{
    getUserSuggestions("AU").then(res=>{
      const arr = res.obj.map((sugg:any)=>{
        const temp:FieldValues={};
        temp["label"]=sugg["N"]+`<${sugg["E"]}>`;
        temp["values"] = sugg;
        return temp;
      });
      setUsers(arr);
    })
  },[]);

  useEffect(()=>console.log("fieldvalues",fieldValues),[fieldValues]);

  const getData = () => {
    //get list of teams
    setTeamList([
      {N:"Enterprise", L:"Jim Kirk", createdAt:new Date(), S:"Active"},
      {N:"Defiant", L:"Ben Sisko", createdAt:new Date(), S:"Inactive"}
    ])
  }
  
  if (!users || users.length==0)
    return<></>;

  return (
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
      <br />
      <div className="w-[50%] flex flex-row mx-7">
        <div className="flex-auto">
          <ComboboxField index={0} 
            fieldData={{id:"user",name:"Select a user", type:"combobox"}} 
            suggestions={users}
            fieldValue={fieldValues["user"]} setFieldValues={setFieldValues} disabled={false}
            placeholder="Search by user name or email"
          />
        </div>
        <Button variant="contained" color="secondary" sx={{ height:"55px", margin:"auto"}} disabled={!(fieldValues["user"] && Object.keys(fieldValues["user"]).length!=0)} onClick={getData}><SendIcon/></Button>
      </div>
      <div className="m-7">
        {teamList
          ?<DataTable className="bg-white rounded-xl"
            headingRows={["Team Name", "Team Lead", "Created On", "Status"]}
            tableData={teamList} columnIDs={["N","L","createdAt","S"]} dataTypes={["checkbox","text", "text","date", "team-status"]}
            cellClassName={["","","","text-left"]}
          />
          :<></>
        }
      </div>      
    </div>
  )
}

export default TeamTransfer;