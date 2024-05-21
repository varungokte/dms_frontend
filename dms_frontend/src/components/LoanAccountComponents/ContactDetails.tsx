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
import { ContactType, EnumIteratorKeys, EnumIteratorValues } from "../BasicComponents/Constants";


function ContactDetails(props:any) {
  //contacts is an object where the keys are the categories (like borrower, lender, promoter) and values are arrays of people
  //Each person is an array: [Name, Designation, Landline Number, Mobile Number, Email, Regitered Address, Billing Address]
  const [contacts, setContacts] = useState<any>({
    0:[{},{}],
    1:[],
    2:[],
  });

  useEffect(()=>{
    console.log("contacts list",contacts);
  },[contacts])

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
      { id: "CT", type: "select", name: "Contact Type", options: EnumIteratorValues(ContactType), required:true },
      { id: "CE", type:"email", name: "Email Address", required:true }, 
      { id: "RT", type:"select", name: "Email Recipient Type", options: ["To", "Cc","Bcc"] },
      { id: "CN", type:"text", name: "Company Name", required:true },
      { id: "D", type:"text", name: "Designation", required:true },
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
  const [role, setRole] = useState(1);

  const {addContact, getContacts} = useGlobalContext();

  useEffect(()=>{
    console.log ("CONTACT ID", props)
    getContacts(loanId).then(res=>{
      console.log("the response ",res);
      let x=0;
      const obj:any={};
      res.map((contact:any)=>{
        console.log(++x);
        console.log(contact)
        //console.log("contatc type",contact,contact.CT, obj)
        obj[contact.CT].push(contact);
      })
      setContacts(obj);
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
          <Filter setter={setRole} listsAreSame={false} 
            labelList={EnumIteratorValues(ContactType)} valueList={EnumIteratorKeys(ContactType)}
            /* setPlaceholder={true} placeholderValue={[-1,"Priority"]} */ 
            />
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
        {contacts[role-1]?contacts[role-1].map((person:any,index:number)=>{
          const regEx = new RegExp(searchString, "i");
          try
          {if (searchString=="" || (person.PN+"").search(regEx)!==-1)
            return(
              <Card key={index} className="m-5 w-72 rounded-xl">
                <CardHeader>
                  <CardTitle>	
                    <div className="flex flex-row">
                      <div className="flex-auto">
                        <ProfileIcon name={person.PN} size="small" />
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
                  <p className="font-medium">{person.PN}</p>
                  <p className="font-light">{person.CE}</p>
                  <p className="font-light">{ContactType[role]}</p>
                  <Dialog>
                    <DialogTrigger>View Profile</DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>
                          <div className="flex flex-row">
                            <ProfileIcon name={person.PN} size="small" />
                            <div className="px-3">
                              <p className="my-1 font-normal text-custom-1">{person.PN}</p>
                              <p className="font-light text-base">{person.D}</p>
                            </div>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        <div className="grid grid-rows-5 grid-flow-col w-full">
                          <div className="m-5">
                            <p className="font-medium">{person.PN}</p>
                            <p className="font-light">Contact Person Name</p>
                          </div>

                          <div className="m-5">
                            <p className="font-medium">{person.D}</p>
                            <p className="font-light">Designation</p>
                          </div>
                          
                          <div className="m-5">
                            <p className="font-medium">{person.CE}</p>
                            <p className="font-light">Email</p>
                          </div>

                          <div className="m-5">
                            <p className="font-medium">{person.MN}</p>
                            <p className="font-light">Mobile Number</p>
                          </div>

                          <div className="m-5">
                            <p className="font-medium">{person.LN}</p>
                            <p className="font-light">Landline Number</p>
                          </div>

                          <div className="m-5">
                            <p className="font-medium">{person.RA}</p>
                            <p className="font-light">Registered Address</p>
                          </div>

                          <div className="m-5">
                            <p className="font-medium">{person.BA}</p>
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
            }catch(err){
              console.log("error is found")
            }
          }
          ):""}
        </div>
      <br/>
      <FormSectionNavigation isForm={false} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default ContactDetails;