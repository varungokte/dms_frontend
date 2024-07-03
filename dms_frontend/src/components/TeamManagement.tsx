import { useEffect, useState } from "react";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import { Table } from "./ui/table";

import useGlobalContext from "./../../GlobalContext";
import FormDialog from "./FormComponents/FormDialog";
//import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import edit_icon from "./static/edit_icon.svg";
import Search from "./BasicComponents/Search";
import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import { FieldAttributesList } from "../../DataTypes";

function TeamManagement(props:{label:string}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [teamList,setTeamList] = useState<any>();

  const [fieldList] = useState<FieldAttributesList>([
    { category:"grid", row:2, fields:[
      { id:"N", name:"Team Name", type:"text", required:true },
      { id:"L", name:"Team Lead", type:"combobox", multiple:false, required:true },
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
  
  const { addTeam, getTeamsList} = useGlobalContext();
  const { toast } = useToast();

  const [searchString, setSearchString] = useState("");

  useEffect(()=>{
    selectedTeam;
    searchString;
    teamStatus;
    if (added){
      getTeamsList().then(res=>{
        console.log("res",res)
        if (res.status==200 && res.obj.length!=0){
         setTeamList(res.obj.list);}
        else
          setTeamList([])
      }).catch(()=>{
        setTeamList([])
      })
      setAdded(false);
    }
  },[added]);

  const teamMembersToArr = (userValues:any) =>{
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

  const createTeam = async (userValues:any, getSugg?:boolean) => {
    let data:any = {} 
    if (!getSugg)
      data = teamMembersToArr(userValues);
    else
      data = userValues;
    //console.log("SUBMITTED",data);

    const res = await addTeam(data);
    //console.log("response",res)
    if (res==200){
      setAdded(true);
      toast({
        title: "Success!",
        description: "The team has been created",
        className:"bg-white"
      });
    };

    return res;
  }

  const editTeam = async (userValues:any) => {
    const data = teamMembersToArr(userValues);
    data["_id"] = userValues["_id"];
    //console.log("SUBMITTED", data);

    const res = await addTeam(data);

    if (res==200){
      setAdded(true);
      toast({
        title: "Success!",
        description: "Team members added",
        className:"bg-white"
      });
    };

    return res;
  }

  useEffect(()=>{
    editTeam({"S":teamStatus}).then(()=>{
    }).catch(err=>{console.log(err)})
    ;
  },[teamStatus]);

  //const deleteTeam = () => {}

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
      <br/>
      <Toaster/>
      <div className="flex flex-row">
        <div className="flex-auto"><Search label={"Search by Team Name"} setter={setSearchString} className=" mx-7" /></div>
        <div>
          <FormDialog key={-1} index={-1} type="team"
            triggerText="Add Team" triggerClassName={`${CreateButtonStyling} mx-7`} formSize="medium"
            formTitle="Add Team" formSubmit={createTeam} submitButton="Add"
            form={fieldList} currentFields={{}}
            suggestions="RM"
          />
        </div>
      </div>
      <div className="m-7">
        {teamList
          ?teamList.length==0
            ?<EmptyPageMessage sectionName="teams"/>
            :<Table className="bg-white rounded-xl">
              <HeaderRows headingRows={["Team Name", "Team Lead", "Total Members", "Created On", "Status","Action"]}  />
              <BodyRowsMapping 
                list={teamList} columns={["N","L","M","createdAt","S"]} dataType={["text", "text", "count-team","date", "team-status", "action"]}
                setEntityStatus={setTeamStatus} setSelectedEntity={setSelectedTeam}
                action={teamList.map((_:any, index:number)=>{
                  return(
                    <div className="flex flex-row">
                      <FormDialog key={index} index={index} edit type="team"
                        triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>}
                        formTitle="Edit Team" formSubmit={editTeam} submitButton="Edit Team" formSize="medium"
                        form={fieldList} currentFields={teamList[index]}
                        suggestions="RM"
                      />
                      {/* <DeleteConfirmation thing="user" deleteFunction={deleteTeam} currIndex={index} /> */}
                    </div>
                  )
                })}
              />
            </Table>  
          :<LoadingMessage sectionName="teams" />
        }
      </div>
    </div>
  )
}

export default TeamManagement;