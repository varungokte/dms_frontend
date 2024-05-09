import { useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";

import { EllipsisVertical } from "lucide-react";
import ProfileIcon from "../BasicComponents/ProfileIcon";

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import FormDialog from "../BasicComponents/FormDialog";
import Filter from "../BasicComponents/Filter";
import Search from "../BasicComponents/Search";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";


function ContactDetails(props:any) {
  //contacts is an object where the keys are the categories (like borrower, lender, promoter) and values are arrays of people
  //Each person is an array: [Name, Designation, Landline Number, Mobile Number, Email, Regitered Address, Billing Address]
  const [contacts, setContacts] = useState({
    "Borrower": [["Ben Quadinaros", "Podracer", "123", "123","email@email", "221B Baker Street, London", "221B Baker Street, London"],
                ["Quinlan Vos", "Jedi Master", "456", "456", "example@email.com", "123 ABC", "123 ABC"],],
    "Lender": [["Cad Bane", "Bounty Hunter", "123", "123", "Email.com","1","2"]],
    "Lender's Agent": [["Wilhuff Tarkin", "Admiral", "1","2","email","a","b"],
                      ["Finis Valorum", "Supreme Chancellor", "1","2", "email", "A", "B"]],
  });

  const [fieldValues, setFieldValues]= useState({
    "CT":null, "CE":null, "RT": null, 
    "CN":null, "D":null, "PN": null,
    "MN":null, "LN":null,
    "BA":null, "BP":null,
    "BCC":null, "BS":null, "BC":null,
    "RA":null, "RP":null,
    "RCC":null, "RS":null, "RC":null,
  });

  const [fieldList] = useState([
    { category: "grid", row:3, sectionName:"", fields: [
      { id: "CT", type: "select", name: "Contact Type", options: ["Borrower", "Lender"] },
      { id: "CE", type:"email", name: "Email Address" }, 
      { id: "RT", type:"select", name: "Email Recipient Type", options: ["To", "Cc","Bcc"] },
      { id: "CN", type:"text", name: "Company Name" },
      { id: "D", type:"text", name: "Designation" },
      { id: "PN", type:"text", name: "Contact Person Name" },
      { id: "MN", type:"text", name: "Mobile Number" },
      { id: "LN", type:"text", name: "Landline Number" },
    ]}, 
    { category: "grid", row: 2, sectionName:"Billing Address", customWidth:'[70%_auto]', fields:[
      { id: "BA", type:"text", name: "Bulding/Street/Locality Name" },
      { id: "BP", type:"number", name: "Pincode" },
    ]},
    { category:"grid", row: 3, fields:[
      { id: "BCC", type:"text", name: "Country" },
      { id: "BS", type:"text", name: "State" },
      { id: "BC", type:"text", name: "City" },
    ]}, 
    { category: "grid", row: 2, sectionName:"Registered Address", customWidth:'[70%_auto]', fields:[
      { id: "RA", type:"text", name: "Bulding/Street/Locality Name" },
      { id: "RP", type:"number", name: "Pincode" },
    ]},
    { category: "grid", row: 3, fields:[
      { id: "RCC", type:"text", name: "Country" },
      { id: "RS", type:"text", name: "State" },
      { id: "RC", type:"text", name: "City" },
    ]},
  ]);

  const [loanId]= useState(props.loanId);
  const [AID]= useState(props.AID);

  const [searchString, setSearchString] = useState("");
  const [role, setRole] = useState("Borrower");
  
  const {addContact, getContacts} = useGlobalContext();

  useEffect(()=>{
    console.log ("CONTACT ID", props)
    getContacts(loanId).then(res=>{
      console.log(res)
    })
  },[])

  const createContact = (e:any) => {
    e.preventDefault();
    console.log("SUBMITTING DATA");
    const data:any = {};
    console.log("AID LAON", data)
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single"){
        //@ts-ignore
        if (fieldValues[field.id]!==null){
          //@ts-ignore
          data[field.id] = fieldValues[field.id];
        }
      }
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          //@ts-ignore
          if (fieldValues[gridField.id]!=null){
            //@ts-ignore
            data[gridField.id] = fieldValues[gridField.id];
          }
        }
      }
    }
    if (Object.keys(data).length!=0){
      console.log("SUBMITTED NOW",data);
      data["AID"]=AID;
      data["_loanId"]= loanId;

      addContact(data, "").then(res=>{
        console.log("ZZZZZZZZZZZZZZZZZZZZZZZZ",res)
      })
    }    
  }

  const editContact = (e:any) =>{
    e.preventDefault();
    const data:any = {};
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single"){
        //@ts-ignore
        if (fieldValues[field.id]!==null){
          //@ts-ignore
          data[field.id] = fieldValues[field.id];
        }
      }
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          //@ts-ignore
          if (fieldValues[gridField.id]!=null){
            //@ts-ignore
            data[gridField.id] = fieldValues[gridField.id];
          }
        }
      }
    }
    
    if (Object.keys(data).length!=0){
      console.log("data", data);

      data["AID"]=AID;
      data["_loanId"]=loanId;
      data["_contactId"]="662f6e086c52bf3e4ec40368";

      addContact(data,"EDIT").then(res=>{
        console.log("EDITED", res)
      })
    }
  }

  return(
    <div className="mt-8">
      <div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search" />
        </div>

        <div className="flex-auto">
          <Filter setter={setRole} listsAreSame={true} labelList={Object.keys(contacts).sort()} />
        </div>
      
        <div className="mr-3">
          <FormDialog
            triggerText="+ Add Contact" triggerClassName={CreateButtonStyling} formSize="large"
            formTitle="Add New Contact"  formSubmit={createContact} submitButton="Add Contact"
            form = {fieldList} setter={setFieldValues}
          />
        </div>
      </div>
      <div className="flex flex-row">
        {//@ts-ignore
        contacts[role].map((person,index)=>{
          const regEx = new RegExp(searchString, "i");
          if (searchString=="" || (person[0]+"").search(regEx)!==-1)
          return(
            <Card key={index} className="m-5 w-72 rounded-xl">
              <CardHeader>
                <CardTitle>	
                  <div className="flex flex-row">
                    <div className="flex-auto">
                      <ProfileIcon name={person[0]} size="small" />
                    </div>
                    <div className="">
                      <DropdownMenu>
                        <DropdownMenuTrigger><EllipsisVertical/></DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem>
                          
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p className="font-medium">{person[0]}</p>
                <p className="font-light">{person[4]}</p>
                <p className="font-light">{role}</p>
                <Dialog>
                  <DialogTrigger>View Profile</DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>
                        <div className="flex flex-row">
                          <ProfileIcon name={person[0]} size="small" />
                          <div className="px-3">
                            <p className="my-1 font-normal text-custom-1">{person[0]}</p>
                            <p className="font-light text-base">{person[1]}</p>
                          </div>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <div className="grid grid-rows-5 grid-flow-col w-full">
                        <div className="m-5">
                          <p className="font-medium">{person[0]}</p>
                          <p className="font-light">Contact Person Name</p>
                        </div>

                        <div className="m-5">
                          <p className="font-medium">{person[1]}</p>
                          <p className="font-light">Designation</p>
                        </div>
                        
                        <div className="m-5">
                          <p className="font-medium">{person[4]}</p>
                          <p className="font-light">Email</p>
                        </div>

                        <div className="m-5">
                          <p className="font-medium">{person[3]}</p>
                          <p className="font-light">Mobile Number</p>
                        </div>

                        <div className="m-5">
                          <p className="font-medium">{person[2]}</p>
                          <p className="font-light">Landline Number</p>
                        </div>

                        <div className="m-5">
                          <p className="font-medium">{person[5]}</p>
                          <p className="font-light">Registered Address</p>
                        </div>

                        <div className="m-5">
                          <p className="font-medium">{person[6]}</p>
                          <p className="font-light">Billing Address</p>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
                <br/>
                <FormDialog
                  triggerText={"Edit"}  formSize="large"
                  formTitle="Edit Contact" formSubmit={editContact} submitButton="Add User"
                  form = {fieldList} setter={setFieldValues} 
                />
              </CardContent>
            </Card>
            )
          })}
        </div>
      <br/>
      <FormSectionNavigation isForm={false} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default ContactDetails;