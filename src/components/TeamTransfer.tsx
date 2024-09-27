import { useEffect, useState } from "react";
import { getUserSuggestions } from "@/apiFunctions/suggestionAPIs";
import { FieldValues, ToastOptionsAttributes, UserSuggestionsList } from "@/types/DataTypes";
import { getSingleUserTeams, removeFromTeams, replaceInTeam } from "@/apiFunctions/teamAPIs";
import { FieldAttributesList } from "@/types/FormAttributes";
import { getDocSecList, getDocSecName } from "@/functions/sectionNameAttributes";

import ComboboxField from "./FormFieldComponents/ComboboxField";
import Button from "@mui/material/Button/Button";
import DataTable from "./BasicTables/Table";
import Filter from "./BasicComponents/Filter";
import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
//import FormDialog from "./FormComponents/FormDialog";
import FormDialogTeam from "./FormComponents/FormDialogTeam";
import Toast from "./BasicComponents/Toast";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";

import { Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import LoopIcon from '@mui/icons-material/Loop';

function TeamTransfer(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [users, setUsers] = useState<UserSuggestionsList>();

  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [action, setAction] = useState<"Remove"|"Replace">("Remove");

  type TeamList = {
    teamDetails: {_id:string, N:string, L:string, S:string},
    isOnlyMember: boolean,
    roles: string[]
  }[];

  const [teamList, setTeamList] = useState<TeamList>();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [disabledReasons, setDisabledReasons] = useState<string[]>([]);
  
  const [openDelete, setOpenDelete] = useState([false]);
  const [openEdit, setOpenEdit] = useState<boolean[]>([]);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
  const [added, setAdded] = useState(false);

  const replaceFieldList:FieldAttributesList = [{
    category:"grid", row:2, fields:[
      {id:"curr", name:"Current User", type:"text", disabled:true, readonly:true},
      {id:"new", name:"Replacement User", type:"combobox", required:true}
    ]
  }];

  useEffect(()=>{
    getUserSuggestions("AU").then(res=>{
      const arr = res.obj.map((sugg:any)=>{
        const temp ={
          label:sugg["N"]+`<${sugg["E"]}>`,
          values: sugg
        }
        return temp;
      });
      setUsers(arr);
    })
  },[]);

  const fixTeamData = (data:FieldValues[]) => {
    const currentUserEmail = fieldValues["user"].values["E"];
    const currentUserName = fieldValues["user"].values["N"];
    const teamsData:TeamList = [];
    const documentSections = getDocSecList("keyname");
    const subsections = ["M","C"];
    const whyDisabled = [];

    for (let i=0; i<data.length; i++){
      const singleTeam = data[i];
      const teamDetails = {
        _id:singleTeam["_id"],
        N:singleTeam["N"],
        L:singleTeam["L"],
        createdAt:singleTeam["createdAt"],
        S:singleTeam["S"]
      }
      let isOnlyMember = false;
      if (singleTeam["L"]==currentUserEmail){
        whyDisabled.push(`${currentUserName} cannot be removed from ${singleTeam["N"]} because they are the team lead`);
        isOnlyMember = true;
      }
      const roles = [];

      for (let j=0; j<documentSections.length; j++){
        const sectionName = documentSections[j];
        const sectionObj = singleTeam[sectionName];
        if (!sectionObj)
          continue;
        for (let k=0; k<subsections.length; k++){
          const subsectionName = subsections[k];
          const subsectionArr = sectionObj[subsectionName];
          if (!subsectionArr || subsectionArr.length==0)
            continue;
          //console.log("subsectionArr",subsectionArr,currentUserEmail)
          if (subsectionArr.includes(currentUserEmail)){
            roles.push(`${sectionName}.${subsectionName}`);
            if (subsectionArr.length==1 && !isOnlyMember){
              isOnlyMember = true;
              whyDisabled.push(`${currentUserName} cannot be removed from ${singleTeam["N"]} because they are the only ${subsectionName=="M"?"maker":"checker"} for ${getDocSecName({inputName:sectionName, inputType:"keyname", outputType:"fullname"})}`);
            }
          }
        }
      }
      if (!isOnlyMember)
        whyDisabled.push("");
      teamsData.push({
        teamDetails:teamDetails,
        isOnlyMember:isOnlyMember,
        roles:roles
      })
    }
    setTeamList(teamsData);
    setDisabledReasons(whyDisabled);
  }

  const getData = () => {
    getSingleUserTeams({email:fieldValues["user"].values["E"]}).then(res=>{
      if (res.status==200){
        const data = res.obj[0]["data"]; 
        console.log("teams response",data);
        fixTeamData(data);
        //setTeamList(data);
        setOpenEdit(new Array(data.length).fill(false));
        setFieldValues(curr=>{
          curr["curr"] = curr["user"].label;
          return {...curr}
        })
      }
      else
        setTeamList([]);
    }).catch(()=>setTeamList([]));
  };

  const removeUser = async () => {
    const finalTeams = [];
    if (!teamList)
      return;
    
    for (let i=0; i<teamList.length;i++){
      const singleTeam = teamList[i];
      if (selectedTeams.includes(singleTeam.teamDetails._id)){
        finalTeams.push(/* {
          _id: */singleTeam.teamDetails._id/* ,
          roles:singleTeam.roles
        } */)
      }
    }
    
    if (finalTeams.length==0)
      return;
    const res = await removeFromTeams({E:fieldValues["user"]["values"]["E"], V:finalTeams});
    
    if (res==200){
      setToastOptions({open:true, type:"success", action:"remove", section:"User"});
      setAdded(true);
      setSelectedTeams([]);
    }
    else
      setToastOptions({open:true, type:"error", action:"remove", section:"User"});
  }

  const replaceUser = async (prefillValue:any)=>{
    const data = {
      _id:prefillValue["_id"] as string,
      new:prefillValue["new"].values["E"] as string,
      curr:prefillValue["user"].values["E"] as string
    }
    console.log("submitting",data);
    const res = await replaceInTeam(data);
    return res;
  }

  useEffect(()=>setSelectedTeams([]),[action]);

  useEffect(()=>{
    if (added){
      getData();
      setAdded(false);
    }
  },[added])

  if (!users || users.length==0)
    return<></>;

  return (
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
      <br />
      <div className="grid grid-cols-3 mx-7">
        <div className="">
          <ComboboxField index={0} fieldData={{id:"user",name:"Select a user", type:"combobox"}} placeholder="Search by user name or email" suggestions={users} fieldValue={fieldValues["user"]} setFieldValues={setFieldValues} disabled={false} />
        </div>
        <div className="my-auto pt-1">
          <Button variant="contained" color="secondary" sx={{ height:"55px", margin:"auto"}} disabled={!(fieldValues["user"] && Object.keys(fieldValues["user"]).length!=0)} onClick={getData}>
            <SendIcon/>
          </Button>
        </div>
        <div className="my-auto flex flex-row">
          <div className="my-auto flex-auto">
            {selectedTeams && selectedTeams.filter(t=>t).length!=0 && action=="Remove" && <Button variant="contained" color="error" size="large" onClick={()=>setOpenDelete([true])}><Typography textTransform={"capitalize"}>{`Remove from Team${selectedTeams&&selectedTeams.filter(t=>t).length>1?"s":""}`}</Typography></Button>}
            {openDelete && <DeleteConfirmation thing={`user from ${selectedTeams&&selectedTeams.filter(t=>t).length>1?"these teams":"this team"}`} deleteFunction={removeUser} open={openDelete[0]} setOpen={setOpenDelete} currIndex={0} />}
          </div>
          <div className="my-auto">
            {teamList && <Filter value={action} setValue={setAction} options={["Remove","Replace"]} />}
          </div>
        </div>        
      </div>
      <div className="mx-7">
        {teamList
          ?teamList.length==0
          ?<EmptyPageMessage sectionName="No teams for this user." override />
          :<div>
            <div className="flex flex-row">
              <div className="flex-auto"></div>
            </div>
            <br />
            <DataTable className="bg-white rounded-xl"
              columnData= {[
                { id:"N", heading:"Team Name", type:"text" },
                { id:"L", heading:"Team Lead", type:"text" },
                { id:"createdAt", heading:"Created On", type:"date" },
                { id:"S", heading:"Status", type:"team-status", cellClassName:"" },
              ]}
              tableData={teamList.map(team=>team.teamDetails)} 
              selectable={action=="Remove"?{type:"checkbox", selectMultiple:action=="Remove", selectedRows:selectedTeams, setSelectedRows:setSelectedTeams}:undefined}
              disabledRows = {action=="Remove"?teamList.map(team=>team.isOnlyMember):undefined}
              tooltipMessages={action=="Remove"?disabledReasons:undefined}
              action={action=="Replace"?teamList.map(team=>team.teamDetails).map((team,index)=>{
                return (
                  <>
                    <Button onClick={()=>setOpenEdit(curr=>{curr[index]=true;return [...curr]})}>
                      <LoopIcon/>
                    </Button>
                    {openEdit[index] && <FormDialogTeam key={index} index={index} formOpen={openEdit[index]} setFormOpen={setOpenEdit}
                      formTitle="Replace User" formSubmit={replaceUser} submitButton="Replace" formSize="md"
                      form={replaceFieldList} currentFields={{...fieldValues,L:{values:{E:team.L}}, _id:team._id}}
                    />}
                  </>
                )
              }):undefined}
              actionAtStart
              actionHeading=""
            />
          </div>
          :<></>
        }
      </div> 
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
    </div>
  )
}

export default TeamTransfer;