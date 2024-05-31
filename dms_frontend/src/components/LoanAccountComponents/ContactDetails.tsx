import { useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "../ui/toaster";

import { ContactType, EnumIteratorKeys, EnumIteratorValues } from "../BasicComponents/Constants";
import ProfileIcon from "../BasicComponents/ProfileIcon";
import Filter from "../BasicComponents/Filter";
import FormDialog from "../BasicComponents/FormDialog";
import Search from "../BasicComponents/Search";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";

import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { CircleUserIcon, Edit2Icon, Plus } from "lucide-react";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";


function ContactDetails(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setOkToChange: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any,}) {
  const [contacts, setContacts] = useState<any>({});

  const [fieldValues, setFieldValues]= useState<any>({});

  const [fieldList] = useState<any>([
    { category: "grid", row:3, sectionName:"", fields: [
      { id: "CT", type: "select", name: "Contact Type", options: EnumIteratorValues(ContactType), required:true },
      { id: "CE", type:"email", name: "Email Address", required:true, immutable:true }, 
      { id: "RT", type:"select", name: "Email Recipient Type", options: ["To", "Cc","Bcc"] },
      { id: "CN", type:"text", name: "Company Name", required:true },
      { id: "D", type:"text", name: "Designation", required:true },
      { id: "PN", type:"text", name: "Contact Person Name",required:true },
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
  const [added, setAdded] = useState(true);
  const [oldValues, setOldValues] = useState<any>({});

  const {addContact, getContacts} = useGlobalContext();
  const { toast } = useToast();

  useEffect(()=>{
    if (added)
      getContacts(loanId).then(res=>{
        const obj:any={};
        res.map((contact:any)=>{
          if (Number(contact.CT)==0)
            return;
          if (obj[Number(contact.CT)])
            obj[Number(contact.CT)].push(contact);  
          else
            obj[Number(contact.CT)] = [contact];
        })
        setContacts(obj);
        setAdded(false);
      })
  },[added]);


  const createContact = () => {
    const data:any = {};
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single"){
        if (fieldValues[field.id]!==null)
          data[field.id] = fieldValues[field.id];
      }
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          if (fieldValues[gridField.id]!=null){
            data[gridField.id] = fieldValues[gridField.id];
          }
        }
      }
    }
    if (Object.keys(data).length!=0){
      data["AID"]=AID;
      data["_loanId"]= loanId;

      addContact(data, "").then(res=>{
        if (res==200)
          setAdded(true);
        
        else if (res==422){
          toast({
            title: "Error!",
            color: "red",
            description: "A contact with the same email already exists",
            className:"bg-white text-red-600"
          })
        }
      })
    }    
  }

  const editContact = () =>{
    const data:any = {};

    console.log("inside edit, oldValues", oldValues)

    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single"){
        if (fieldValues[field.id]!==null && fieldValues[field.id]!==oldValues[field.id])
          data[field.id] = fieldValues[field.id];
      }
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          if (fieldValues[gridField.id]!=null && fieldValues[gridField.id]!==oldValues[gridField.id])
            data[gridField.id] = fieldValues[gridField.id];
        }
      }
    }
    
    if (Object.keys(data).length!=0){
      data["AID"]=AID;
      data["_loanId"]=loanId;
      data["_contactId"]=oldValues._id

      console.log("submitted data", data)
      /* addContact(data,"EDIT").then(res=>{
        console.log("EDITED", res)
      }) */
    }
  }

  return(
    <div className="mt-8">
      <div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search" />
        </div>

        <div className="flex-auto">
          <Filter setter={setRole} listsAreSame={false} labelList={EnumIteratorValues(ContactType)} valueList={EnumIteratorKeys(ContactType)}/>
        </div>
      
        <div className="mr-3">
          <FormDialog key={-5} index={-5} edit={false}
            triggerText={<div className="flex flex-row"><Plus className="mt-1"/> <p className="">Add Contact</p></div>} triggerClassName={CreateButtonStyling} formSize="large"
            formTitle="Add New Contact" formSubmit={createContact} submitButton="Add Contact"
            form={fieldList} setter={setFieldValues} fieldValues={fieldValues} currentFields={fieldValues}
          />
        </div>
      </div>
      <Toaster/>
      <div className="flex flex-row flex-wrap">
        {(contacts[role] && contacts[role].length>0)?contacts[role].map((person:any,index:number)=>{
          const regEx = new RegExp(searchString, "i");
          if (searchString=="" || (person.PN+"").search(regEx)!==-1)
            return(
              <Card key={index} className="m-5 w-72 rounded-xl">
                <CardHeader>
                  <CardTitle>	
                    <div className="flex flex-row">
                      <div className="flex-auto">
                        <ProfileIcon name={person.PN} size="small" />
                      </div>
                      <div className="">
                        <div className="flex flex-row">
                        <FormDialog key={index} index={index} edit={true}
                          triggerText={<Edit2Icon size={"20px"}/>} formSize="large"
                          formTitle="Edit Contact" formSubmit={editContact} submitButton="Edit Contact"
                          form={fieldList} setter={setFieldValues} fieldValues={fieldValues} currentFields={person}
                        />
                        <div className="ml-2">
                        <Dialog>
                          <DialogTrigger><CircleUserIcon/></DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader>
                              <DialogTitle>
                                <div className="flex flex-row">
                                  <ProfileIcon name={person.PN} size="small" />
                                  <div className="px-3">
                                    <p className="my-1 font-normal text-custom-1">{person.PN || "person_name"}</p>
                                    <p className="font-light text-base">{person.D}</p>
                                  </div>
                                </div>
                              </DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                              <div className="grid grid-rows-5 grid-flow-col w-full">
                                <div className="m-5">
                                  <p className="font-medium">{person.PN || "N/A"}</p>
                                  <p className="font-light">Contact Person Name</p>
                                </div>

                                <div className="m-5">
                                  <p className="font-medium">{person.D || "N/A"}</p>
                                  <p className="font-light">Designation</p>
                                </div>
                                
                                <div className="m-5">
                                  <p className="font-medium">{person.CE || "N/A"}</p>
                                  <p className="font-light">Email</p>
                                </div>

                                <div className="m-5">
                                  <p className="font-medium">{person.MN || "N/A"}</p>
                                  <p className="font-light">Mobile Number</p>
                                </div>

                                <div className="m-5">
                                  <p className="font-medium">{person.LN || "N/A"}</p>
                                  <p className="font-light">Landline Number</p>
                                </div>

                                <div className="m-5">
                                  <p className="font-medium">{person.RA || "N/A"}</p>
                                  <p className="font-light">Registered Address</p>
                                </div>

                                <div className="m-5">
                                  <p className="font-medium">{person.BA || "N/A"}</p>
                                  <p className="font-light">Billing Address</p>
                                </div>
                              </div>
                            </DialogDescription>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-left">
                  <p className="font-medium">{person.PN || "person_name"}</p>
                  <p className="font-light">{person.CE || "email"}</p>
                  <p className="font-light">{ContactType[role]}</p>     
                  <br/>
                </CardContent>
              </Card>
            )
        }):<EmptyPageMessage sectionName="contacts" />}
      </div>
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default ContactDetails;