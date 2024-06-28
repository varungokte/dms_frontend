import { useEffect, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { FieldAttributesList, LoanCommonProps } from "./../../../DataTypes";

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "../ui/toaster";

import { ContactTypeList, EmailRecipientList } from "../../../Constants";
import ProfileIcon from "../BasicComponents/ProfileIcon";
import Filter from "../BasicComponents/Filter";
import FormDialog from "../FormComponents/FormDialog";
import Search from "../BasicComponents/Search";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";

import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { CircleUserIcon, Edit2Icon, Plus } from "lucide-react";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import LoadingMessage from "../BasicComponents/LoadingMessage";


function LoanContactDetails(props:LoanCommonProps) {
  const [contacts, setContacts] = useState<any>();

  const [fieldList] = useState<FieldAttributesList>([
    { category: "grid", row:3, sectionName:"", fields: [
      { id: "CT", type: "select", name: "Contact Type", options: ContactTypeList, required:true },
      { id: "CN", type:"text", name: "Company Name", required:true },
      { id: "PN", type:"text", name: "Contact Person Name",required:true },
      { id: "D", type:"text", name: "Designation", required:true },
      { id: "MN", type:"text", name: "Mobile Number" },
      { id: "LN", type:"text", name: "Landline Number" },
      { id: "CE", type:"email", name: "Email Address", required:true, immutable:true }, 
      { id: "RT", type:"select", name: "Email Recipient Type", options:EmailRecipientList },
    ]}, 
    { category: "grid", row: 2, sectionName:"Billing Address", sectionClassName:"text-2xl font-medium my-2", customWidth:'[70%_auto]', fields:[
      { id: "BA", type:"text", name: "Bulding/Street/Locality Name" },
      { id: "BP", type:"number", name: "Pincode" },
    ]},
    { category:"grid", row: 3, fields:[
      { id: "BCC", type:"text", name: "Country" },
      { id: "BS", type:"text", name: "State" },
      { id: "BC", type:"text", name: "City" },
    ]}, 
    { category: "grid", row: 2, sectionName:"Registered Address", sectionClassName:"text-2xl font-medium my-2", customWidth:'[70%_auto]', fields:[
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
  const [role, setRole] = useState(ContactTypeList[1]);
  const [added, setAdded] = useState(true);
  const [oldValues, /* setOldValues */] = useState<any>({});

  const {addContact, getContacts} = useGlobalContext();
  const { toast } = useToast();

  useEffect(()=>{
    if (added)
      getContacts(loanId).then(res=>{
        if (res.status!=200){
          setContacts({});
        }
        const obj:any={};
        res.data.map((contact:any)=>{
          if (contact.CT=="-")
            return;
          if (obj[contact.CT])
            obj[contact.CT].push(contact);  
          else
            obj[contact.CT] = [contact];
        })
        setContacts(obj);
        setAdded(false);
      })
  },[added]);


  const createContact = async (userValues:any) => {
    const data:any = {};
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single"){
        if (userValues[field.id]!==null)
          data[field.id] = userValues[field.id];
      }
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          if (userValues[gridField.id]!=null){
            data[gridField.id] = userValues[gridField.id];
          }
        }
      }
    }
    if (Object.keys(data).length!=0){
      data["AID"]=AID;
      data["_loanId"]= loanId;

      const res = await addContact(data,"");
      
      if (res==200){
        setAdded(true);
        toast({
          title: "Success!",
          description: "Contact Created",
          className:"bg-white"
        })
      }

      return res;
    }
  }

  const editContact = (userValues:any) =>{
    const data:any = {};

    console.log("inside edit, oldValues", oldValues)

    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single"){
        if (userValues[field.id]!==null && userValues[field.id]!==oldValues[field.id])
          data[field.id] = userValues[field.id];
      }
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          if (userValues[gridField.id]!=null && userValues[gridField.id]!==oldValues[gridField.id])
            data[gridField.id] = userValues[gridField.id];
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
          <Search setter={setSearchString} label="Search" className="mx-5" />
        </div>

        <div className="flex-auto">
          <Filter value={role} setValue={setRole} options={ContactTypeList}/>
        </div>
      
        <div className="mr-3">
          <FormDialog key={-5} index={-5} edit={false} type="cont"
            triggerText={<div className="flex flex-row"><Plus className="mt-1"/> <p className="">Add Contact</p></div>} triggerClassName={CreateButtonStyling} formSize="large"
            formTitle="Add New Contact" formSubmit={createContact} submitButton="Add Contact"
            form={fieldList} currentFields={{}}
          />
        </div>  
      </div>
      <Toaster/>
      <div className="flex flex-row flex-wrap">
        {contacts
          ?(contacts[role] && contacts[role].length>0)?contacts[role].map((person:any,index:number)=>{
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
                          <FormDialog key={index} index={index} edit={true} type="cont"
                            triggerText={<Edit2Icon size={"20px"}/>} formSize="large"
                            formTitle="Edit Contact" formSubmit={editContact} submitButton="Edit Contact"
                            form={fieldList} currentFields={person}
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
                    <p className="font-light">{role}</p>     
                    <br/>
                  </CardContent>
                </Card>
              )
            }):<EmptyPageMessage sectionName="contacts" />
          :<LoadingMessage sectionName="contacts" />
        }
      </div>
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default LoanContactDetails;