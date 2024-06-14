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
import { FormFieldDetails } from "../../DataTypes";

function TeamManagement(){
  const [teamList,setTeamList] = useState<any>();

  const [fieldList] = useState<FormFieldDetails>([
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
    ]}
  ]);
  const [fieldValues, setFieldValues] = useState<any>({});
  
  const [added, setAdded] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamStatus, setTeamStatus] = useState(-1);
  
  const {useTitle, addTeam, getTeamsList} = useGlobalContext();
  const { toast } = useToast();

  useTitle("Team Management");

  const [searchString, setSearchString] = useState("");

  useEffect(()=>{
    selectedTeam;
    searchString;
    teamStatus;
    if (added){
      getTeamsList().then(res=>{
        if (res.status==200 && res.obj.length!=0){console.log(res.obj.list)
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
    const sections = ["TD","CD","C","CP","CS"];
    sections.map(name=>{
      data[name]={
        M:userValues[`${name}M`].map((obj:any)=>obj.values?obj.values["E"]:obj),
        C:userValues[`${name}C`].map((obj:any)=>obj.values?obj.values["E"]:obj)
      }
    });
    return data;
  }

  const createTeam = async (userValues:any) => {
    const data = teamMembersToArr(userValues);
    console.log("SUBMITTED",data);

    const res = await addTeam(data);

    if (res==200){
      setAdded(true);
      toast({
        title: "Success!",
        description: "The team has been created",
        className:"bg-white"
      });
      setFieldValues({});
    };

    return res;
  }

  const editTeam = (userValues:any) => {
    console.log("raw data",userValues);
    const data = teamMembersToArr(userValues);
    console.log("SUBMITTED", data)
    return 200;
  }

  //const deleteTeam = () => {}

  return(
    <div>
			<p className="text-3xl font-bold m-7">Team Management</p>
      <br/>
      <Toaster/>
      <div className="flex flex-row">
        <div className="flex-auto"><Search label={"Search by Team Name"} setter={setSearchString} /></div>
        <div>
          <FormDialog key={-1} index={-1} type="team"
            triggerText="Add Team" triggerClassName={CreateButtonStyling} formSize="medium"
            formTitle="Add Team" formSubmit={createTeam} submitButton="Add"
            form={fieldList} fieldValues={fieldValues} setter={setFieldValues} currentFields={{}}
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
                list={teamList} columns={["N","L","M","createdAt","S"]} dataType={["text", "text", "countTeam","date", "teamStatus", "action"]}
                searchRows={[]} filterRows={[]}
                setEntityStatus={setTeamStatus} setSelectedEntity={setSelectedTeam}
                action={teamList.map((_:any, index:number)=>{
                  return(
                    <div className="flex flex-row">
                      <FormDialog key={index} index={index} edit type="team"
                        triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>}
                        formTitle="Edit Team" formSubmit={editTeam} submitButton="Edit Team" formSize="medium"
                        form={fieldList} setter={setFieldValues} fieldValues={fieldValues} currentFields={teamList[index]}
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