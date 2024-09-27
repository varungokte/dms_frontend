import { useContext, useEffect, useState } from "react";
import { FieldValues, ToastOptionsAttributes } from "@/types/DataTypes";
import { getModSecName } from "@/functions/sectionNameAttributes";
import { FieldAttributesList } from "@/types/FormAttributes";
import { PermissionContext } from "@/Contexts";
import { addTeam, editTeam, getTeamsList } from "@/apiFunctions/teamAPIs";

import DataTable from "./BasicTables/Table";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import FormDialogTeam from "./FormComponents/FormDialogTeam";
import { Pagination } from "./BasicComponents/Pagination";
import Toast from "./BasicComponents/Toast";
import SearchByType from "./BasicComponents/SearchByType";
import AddButton from "./BasicButtons/AddButton";

//import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import edit_icon from "@/static/edit_icon.svg";

function TeamManagement(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [teamList,setTeamList] = useState<any>();
  const {userPermissions} = useContext(PermissionContext);

  /* Team Naming Format 
    Combined: {TD:{M:[], C:[]}}
    Separate: {TDM:[], TDC:[]}
  */

  const fieldList:FieldAttributesList = [
    { category:"grid", row:2, fields:[
      { id:"N", name:"Team Name", type:"text", required:true },
      { id:"L", name:"Team Lead", type:"combobox", multiple:false, immutable:true, required:true },
    ]},
    { category:"label", name:"Team Members", sectionClassName:"text-2xl font-medium my-2" },
    { category:"grid", row:2, sectionName:"Transaction Documents", sectionClassName:"text-lg font-medium my-2", fields:[
      { id: "TDM", name:"Maker", type:"combobox", multiple:true, required:true},
      { id: "TDC", name:"Checker", type:"combobox", multiple:true, required:true},
    ]},
    { category:"grid", row:2, sectionName:"Compliance Documents", sectionClassName:"text-lg font-medium my-2", fields:[
      { id: "CDM", name:"Maker", type:"combobox", multiple:true, required:true},
      { id: "CDC", name:"Checker", type:"combobox", multiple:true, required:true},
    ]},
    { category:"grid", row:2, sectionName:"Covenants", sectionClassName:"text-lg font-medium my-2", fields:[
      { id: "CM", name:"Maker", type:"combobox", multiple:true, required:true},
      { id: "CC", name:"Checker", type:"combobox", multiple:true, required:true},
    ]},
    { category:"grid", row:2, sectionName:"Condition Precedent", sectionClassName:"text-lg font-medium my-2", fields:[
      { id: "CPM", name:"Maker", type:"combobox", multiple:true, required:true},
      { id: "CPC", name:"Checker", type:"combobox", multiple:true, required:true},
    ]},
    { category:"grid", row:2, sectionName:"Condition Subsequent", sectionClassName:"text-xl font-medium my-2", fields:[
      { id: "CSM", name:"Maker", type:"combobox", multiple:true, required:true},
      { id: "CSC", name:"Checker", type:"combobox", multiple:true, required:true},
    ]},
    { category:"grid", row:2, sectionName:"Payment Schedule", sectionClassName:"text-xl font-medium my-2", fields:[
      { id: "PDM", name:"Maker", type:"combobox", multiple:true, required:true},
      { id: "PDC", name:"Checker", type:"combobox", multiple:true, required:true},
    ]}
  ];

  const [addOpen, setAddOpen] = useState([false]);
  const [editOpen, setEditOpen] = useState<boolean[]>([]);

  const [added, setAdded] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(-1);
  const [teamStatus, setTeamStatus] = useState(-1);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  const [searchString, setSearchString] = useState("");
  const [searchType, setSearchType] = useState("");
  const searchOptions = [{label:"Team Name", value:"N"}, {label:"Team Lead's Email", value:"L"}];

  if (!userPermissions)
    return;

  const editPermission = userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("edit");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage,searchString,searchType]);

  useEffect(()=>{
    if (added){
      getTeamsList({currentPage, rowsPerPage, searchString, searchType}).then(res=>{
        console.log("res",res)
        if (res.status==200){
          try{
            const data = res["obj"]["list"][0]["data"];
            setEditOpen(new Array(data.length).fill(false));
            setTotalPages(Math.ceil(Number(res.obj["list"][0]["metadata"][0]["total"])/Number(rowsPerPage)));
            setTeamList(data);
          }
          catch(e){
            setTeamList([]);
          }
        }
        else
          setTeamList([])
      }).catch(()=>{
        setTeamList([])
      })
      setAdded(false);
    }
  },[added]);

  const teamMembersSeparateToCombined = (userValues:any) =>{
    const data:any={};
    data["N"] = userValues["N"];
    data["L"] = userValues["L"].values?userValues["L"].values["E"]:userValues["L"];
    const sections = ["TD","CD","C","CP","CS","PD"];
    sections.map((name)=>{
      data[name]={
        M:userValues[`${name}M`].map((obj:any)=>obj.values?obj.values["E"]:obj),
        C:userValues[`${name}C`].map((obj:any)=>obj.values?obj.values["E"]:obj)
      }
    });
    return data;
  }

  const createTeam = async (userValues:any) => {
    const data = teamMembersSeparateToCombined(userValues);    
    console.log("SUBMITTED",data);

    const res = await addTeam(data);
    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"add", section:"Team"});
    }
    else
      setToastOptions({open:true, type:"error", action:"add", section:"Team"});
    return res;
  }

  const changeTeam = async (userValues:any,index:number,status?:boolean) => {
    if (selectedTeam==-1 && index==-1 || !userValues)
      return;

    let data:FieldValues={};
    if (status){
      data["_id"] = teamList[index]["_id"];
      data["S"] = userValues["S"]
    }
    else{
      data = teamMembersSeparateToCombined(userValues);
      data["_id"] = userValues["_id"];
    }

    console.log("SUBMITTED", data);

    const res = await editTeam(data);
    console.log("response",res)

    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"edit", section:"Team"});
    }
    else
      setToastOptions({open:true, type:"error", action:"edit", section:"Team"});
    return res;
  }

  useEffect(()=>{
    changeTeam({"S":teamStatus}, selectedTeam,true).then(()=>{
    }).catch(err=>{console.log(err)});
  },[teamStatus]);

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
      <div className="flex flex-row">
        <div className="m-auto flex-auto">
          <SearchByType className="mx-7" searchString={searchString} setSearchString={setSearchString} searchType={searchType} setSearchType={setSearchType} typeOptions={searchOptions} />
        </div>
        <div>
          {userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("add")
            ?<div>
              <AddButton sectionName="team" onClick={()=>setAddOpen([true])} />
              {addOpen[0]
                ?<FormDialogTeam key={-1} index={0} formOpen={addOpen[0]} setFormOpen={setAddOpen} formSize="md" edit={false}
                  formTitle="Add Team" formSubmit={createTeam} submitButton="Add"
                  form={fieldList} currentFields={{}}
                />
                :<></>
              }
            </div>
            :<></>
          }
        </div>
      </div>
      <div className="m-7">
        {teamList
          ?teamList.length==0
            ?<EmptyPageMessage sectionName="teams"/>
            :<DataTable className="bg-white rounded-xl"
              tableData={teamList} 
              columnData={[
                {id:"N", heading:"Team Name", type:"text"},
                {id:"L", heading:"Team Lead", type:"text"},
                {id:"createdAt", heading:"Created On", type:"date"},
                {id:"S", heading:"Status", type:"team-status",cellClassName:editPermission?"editable":""}
              ]}
              setEntityStatus={setTeamStatus} setSelectedEntity={setSelectedTeam}
              action={editPermission?teamList.map((_:any, index:number)=>{
                return(
                  <div className="flex flex-row">
                    {editPermission
                      ?<div>
                        <button onClick={()=>setEditOpen(curr=>{curr[index]=true;return [...curr]})}>{<img src={edit_icon} className="mr-5"/>}</button>
                        {editOpen[index]
                          ?<FormDialogTeam key={index} index={index} edit formOpen={editOpen[index]} setFormOpen={setEditOpen}
                            formTitle="Edit Team" formSubmit={changeTeam} submitButton="Edit Team" formSize="md"
                            form={fieldList} currentFields={teamList[index]}
                          />
                          :<></>
                        }
                      </div>
                      :<></>
                    }
                    {/* <DeleteConfirmation thing="user" deleteFunction={deleteTeam} currIndex={index} /> */}
                  </div>
                )
              }):undefined}
            /> 
          :<LoadingMessage sectionName="teams" />
        }
      </div>
      <br />
      {teamList && teamList.length>0
        ?<Pagination className="mx-7" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
    </div>
  )
}

export default TeamManagement;