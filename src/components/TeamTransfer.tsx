import { useEffect, useState } from "react";
import { getUserSuggestions } from "@/apiFunctions/suggestionAPIs";
import { FieldValues, UserSuggestionsList } from "@/types/DataTypes";
import { getSingleUserTeams } from "@/apiFunctions/teamAPIs";

import ComboboxField from "./FormFieldComponents/ComboboxField";
import Button from "@mui/material/Button/Button";
import SendIcon from '@mui/icons-material/Send';
import DataTable from "./BasicTables/Table";
import Filter from "./BasicComponents/Filter";
import LoopIcon from '@mui/icons-material/Loop';

function TeamTransfer(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [users, setUsers] = useState<UserSuggestionsList>();

  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [teamList, setTeamList] = useState<FieldValues[]>();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [action, setAction] = useState<"Remove"|"Replace">("Remove");

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
  
  /* useEffect(()=>{
    setTeamList([
      {_id:"DS9", N:"Defiant", L:"Benjamin Sisko", createdAt:new Date(), S:"Active"},
      {_id:"TOS", N:"Enterprise", L:"James T. Kirk", createdAt:new Date(), S:"Inactive"},
      {_id:"VOY", N:"Voyager", L:"Kathryn Janeway", createdAt:new Date(), S:"Active"}
    ])
  },[]); */

  const getData = () => {
    getSingleUserTeams({email:fieldValues["user"].values["E"]}).then(res=>{
      if (res.status==200)
        setTeamList(res.obj[0]["data"]);
      else
        setTeamList([]);
      console.log("teams response",res);
    }).catch(()=>setTeamList([]));
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
        <Button variant="contained" color="secondary" sx={{ height:"55px", margin:"auto"}} disabled={!(fieldValues["user"] && Object.keys(fieldValues["user"]).length!=0)} onClick={getData}>
          <SendIcon/>
        </Button>
      </div>
      <div className="mx-7">
        {teamList
          ?<div>
            <div className="flex flex-row">
              <div className="flex-auto"></div>
              <div><Filter value={action} setValue={setAction} options={["Remove","Replace"]} /></div>
            </div>
            <br />
            <DataTable className="bg-white rounded-xl"
              columnData= {[
                { id:"N", heading:"Team Name", type:"text" },
                { id:"L", heading:"Team Lead", type:"text" },
                { id:"createdAt", heading:"Created On", type:"date" },
                { id:"S", heading:"Status", type:"team-status", cellClassName:"text-left" },
              ]}
              tableData={teamList} 
              selectable={{type:action=="Remove"?"checkbox":"radio", selectMultiple:action=="Remove", selectedRows:selectedTeams, setSelectedRows:setSelectedTeams, iconOverride:action=="Replace"?<LoopIcon/>:undefined}}
            />
          </div>
          :<></>
        }
      </div>      
    </div>
  )
}

export default TeamTransfer;