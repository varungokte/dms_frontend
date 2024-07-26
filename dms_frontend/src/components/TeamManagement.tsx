import { useContext, useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";

import { DataTable } from "./BasicComponents/Table";
//import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import edit_icon from "./static/edit_icon.svg";
import Search from "./BasicComponents/Search";
import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import { FieldAttributesList, TableDataTypes, ToastOptionsAttributes } from "../../DataTypes";
import FormDialogTeam from "./FormComponents/FormDialogTeam";
import Toast from "./BasicComponents/Toast";
import { sectionNames } from "./../../Constants";
import { PermissionContext } from "@/MenuRouter";
import { Pagination } from "./BasicComponents/Pagination";

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

  const [fieldList] = useState<FieldAttributesList>([
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
  ]);

  const [added, setAdded] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamStatus, setTeamStatus] = useState(-1);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  const { addTeam, getTeamsList} = useGlobalContext();

  const [searchString, setSearchString] = useState("");
  const [tableHeadings, setTableHeadings] = useState(["Team Name", "Team Lead", "Created On", "Status"]);
  const [tableDataTypes, setTableDataTypes] = useState<TableDataTypes[]>(["text", "text","date", "team-status"]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(()=>{
    const editPermission = userPermissions[sectionNames[props.label]].includes("edit");
    const deletePermission = userPermissions[sectionNames[props.label]].includes("delete");
    if (editPermission || deletePermission){
      setTableHeadings(curr=>{
        if (curr [curr.length-1]!="Action")
          curr.push("Action");
        return [...curr];
      });
      setTableDataTypes(curr=>{
        if (curr [curr.length-1]!="action")
          curr.push("action");
        return [...curr];
      });
    }
  },[userPermissions])

  useEffect(()=>{
    if (added){
      getTeamsList({currentPage:currentPage, rowsPerPage:rowsPerPage}).then(res=>{
          console.log("res",res)
        if (res.status==200){
          try{
            const data = res["obj"]["list"][0]["data"];
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

  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage]);

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
    //console.log("SUBMITTED",data);

    const res = await addTeam(data);
    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"add", section:"Team"});
    }
    else
      setToastOptions({open:true, type:"error", action:"add", section:"Team"});
    return res;
  }

  const editTeam = async (userValues:any) => {
    const data = teamMembersSeparateToCombined(userValues);
    data["_id"] = userValues["_id"];

    //console.log("SUBMITTED", data);

    const res = await addTeam(data);

    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"edit", section:"Team"});
    }
    else
      setToastOptions({open:true, type:"error", action:"add", section:"Team"});
    return res;
  }
/* 
  useEffect(()=>{
    editTeam({"S":teamStatus}).then(()=>{
    }).catch(err=>{console.log(err)})
    ;
  },[teamStatus]); */

  //const deleteTeam = () => {}

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
      <br/>
      <div className="flex flex-row">
        <div className="flex-auto"><Search label={"Search by Team Name"} setter={setSearchString} className=" mx-7" /></div>
        <div>
          {userPermissions[sectionNames[props.label]].includes("add")
            ?<FormDialogTeam key={-1} index={-1}
              triggerText="Add Team" triggerClassName={`${CreateButtonStyling} mx-7`} formSize="medium"
              formTitle="Add Team" formSubmit={createTeam} submitButton="Add"
              form={fieldList} currentFields={{}}
            />
            :<></>
          }
        </div>
      </div>
      <div className="m-7">
        {teamList
          ?teamList.length==0
            ?<EmptyPageMessage sectionName="teams"/>
            :<DataTable className="bg-white rounded-xl"
              headingRows={tableHeadings}
              tableData={teamList} columnIDs={["N","L","createdAt","S"]} dataTypes={tableDataTypes}
              cellClassName={["","","","", userPermissions[sectionNames[props.label]].includes("edit")?"editable":"",""]}
              setEntityStatus={setTeamStatus} setSelectedEntity={setSelectedTeam}
              action={teamList.map((_:any, index:number)=>{
                return(
                  <div className="flex flex-row">
                    {userPermissions[sectionNames[props.label]].includes("edit")
                      ?<FormDialogTeam key={index} index={index} edit
                        triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>}
                        formTitle="Edit Team" formSubmit={editTeam} submitButton="Edit Team" formSize="medium"
                        form={fieldList} currentFields={teamList[index]}
                      />
                      :<></>
                    }
                    {/* <DeleteConfirmation thing="user" deleteFunction={deleteTeam} currIndex={index} /> */}
                  </div>
                )
              })}

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