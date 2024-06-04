import { useEffect, useState } from "react";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import { Table } from "./ui/table";

import useGlobalContext from "./../../GlobalContext";
import FormDialog from "./BasicComponents/FormDialog";
import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import edit_icon from "./static/edit_icon.svg";
import Search from "./BasicComponents/Search";
import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";

function TeamManagement(){
  const [teamList,setTeamList] = useState<any>([]);

  const [fieldList] = useState<any>([
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
    { category:"grid", row:2, sectionName:"Condition Subsequent", sectionClassName:"text-xl font-medium my-2", repeatable:true, fields:[
      { id: "CSM", name:"Maker", type:"combobox", multiple:true, required:true},
      { id: "CSC", name:"Checker", type:"combobox", multiple:true, required:true},
    ]}
  ]);
  const [fieldValues, setFieldValues] = useState<any>({});
  
  const [added, setAdded] = useState(true);
  
  const {useTitle, addTeam, getTeamsList} = useGlobalContext();
  const { toast } = useToast();

  useTitle("Team Management");

  const [searchString, setSearchString] = useState("");

  useEffect(()=>{
    if (added)
      getTeamsList().then(res=>{
        console.log("response",res.obj);
        if (res.status==200 && res.obj.length!=0)
         setTeamList(res.obj);
        else
          setTeamList([])
      }).catch(()=>{
        setTeamList([])
      })
  },[added])

  const createTeam = (userValues:any) => {
    console.log("userValues",userValues);
    const data:any={};
    data["N"] = userValues["N"];
    data["L"] = userValues["L"].values;
    const sections = ["TD","CD","C","CP","CS"];
    sections.map(name=>{
      data[name]={
        M:userValues[`${name}M`].map((obj:any)=>obj.values),
        C:userValues[`${name}M`].map((obj:any)=>obj.values)
      }
    });
    console.log("SUBMITTED",data);
    addTeam(data).then(res=>{
      if (res==200){
        setAdded(false);
        toast({
          title: "Success!",
          description: "The team has been created",
          className:"bg-white"
        })}
      else
        toast({
          title: "Error!",
          description: "The team has not been created",
          className:"bg-white"
        })
    }).catch(()=>{
      toast({
        title: "Error!",
        description: "The team has not been created",
        className:"bg-white"
      })
    })
    
  }

  const editTeam = () => {}

  const deleteTeam = () => {}

  return(
    <div>
			<p className="text-3xl font-bold m-7">Team Management</p>
      <br/>
      <Toaster/>
      <div className="flex flex-row">
        <div className="flex-auto"><Search label={"Search by Team Name"} setter={setSearchString} /></div>
        <div>
          <FormDialog key={-1} index={-1}
            triggerText="Add Team" triggerClassName={CreateButtonStyling} formSize="medium"
            formTitle="Add Team" formSubmit={createTeam} submitButton="Add"
            form={fieldList} fieldValues={fieldValues} setter={setFieldValues} currentFields={{}}
            suggestions="AU"
          />
        </div>
      </div>
      <div >
        {teamList.length==0
          ?<EmptyPageMessage sectionName="teams"/>
          :<Table className="bg-white rounded-xl m-5">
            <HeaderRows headingRows={["Team Name", "Team Lead", "Total Members", "Created At", "Status","Action"]} />
            <BodyRowsMapping 
              list={teamList} columns={["N","L","M","createdAt","S"]} dataType={["text", "objName", "countTeam","date", "userStatus", "action"]}
              searchRows={[]} filterRows={[]}
              action={teamList.map((item:any, index:number)=>{
                console.log("ITEM",item)
                return(
                  <div className="flex flex-row">
                    <FormDialog key={index} index={index} edit={true}
                      triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>}
                      formTitle="Edit User" formSubmit={editTeam} submitButton="Edit User" formSize="medium"
                      form={fieldList} setter={setFieldValues} fieldValues={fieldValues} currentFields={teamList[index]}
                    />
                    <DeleteConfirmation thing="user" deleteFunction={deleteTeam} currIndex={index} />
                  </div>
                )
              })}
            />
          </Table>
        }
      </div>
    </div>
  )
}

export default TeamManagement;