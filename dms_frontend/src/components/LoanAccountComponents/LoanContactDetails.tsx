import { ReactElement, useEffect, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { FieldAttributesList, FieldValues, LoanCommonProps } from "./../../../DataTypes";
import { ContactTypeList, EmailRecipientList } from "../../../Constants";

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "../ui/toaster";

import Filter from "../BasicComponents/Filter";
import FormDialog from "../FormComponents/FormDialog";
import Search from "../BasicComponents/Search";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import LoadingMessage from "../BasicComponents/LoadingMessage";

import ProfileIcon from "../BasicComponents/ProfileIcon";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { CircleUserIcon, Edit2Icon, Plus } from "lucide-react";

function LoanContactDetails(props:LoanCommonProps) {
  const allContacts = "All Contacts";

  const [contacts, setContacts] = useState<{[key:string]:FieldValues}>();
  const [fieldList] = useState<FieldAttributesList>([
    { category: "grid", row:3, sectionName:"", fields: [
      { id: "CT", type: "select", name: "Contact Type", options: ContactTypeList, required:true, immutable:true },
      { id: "CN", type:"text", name: "Company Name", required:true },
      { id: "PN", type:"text", name: "Contact Person Name",required:true },
      { id: "D", type:"text", name: "Designation", required:true },
      { id: "MN", type:"text", name: "Mobile Number" },
      { id: "LN", type:"text", name: "Landline Number" },
      { id: "CE", type:"email", name: "Email Address", required:true, immutable:true }, 
      { id: "RT", type:"select", name: "Email Recipient Type", options:EmailRecipientList, required:true },
    ]}, 
    { category: "grid", row: 2, sectionName:"Billing Address", sectionClassName:"text-2xl font-medium my-2", customWidth:'[70%_auto]', fields:[
      { id: "BA", type:"text", name: "Bulding/Street/Locality Name" },
      { id: "BP", type:"integer", name: "Pincode" },
    ]},
    { category:"grid", row: 3, fields:[
      { id: "BCC", type:"text", name: "Country" },
      { id: "BS", type:"text", name: "State" },
      { id: "BC", type:"text", name: "City" },
    ]}, 
    { category:"single", id:"add-same", name:"Billing and Registered Addresses are the same", type:"checkbox"},
    { category: "grid", row: 2, sectionName:"Registered Address", sectionClassName:"text-2xl font-medium my-2", customWidth:'[70%_auto]', fields:[
      { id: "RA", type:"text", name: "Bulding/Street/Locality Name" },
      { id: "RP", type:"integer", name: "Pincode" },
    ]},
    { category: "grid", row: 3, fields:[
      { id: "RCC", type:"text", name: "Country" },
      { id: "RS", type:"text", name: "State" },
      { id: "RC", type:"text", name: "City" },
    ]},
  ]);

  const [searchString, setSearchString] = useState("");
  const [role, setRole] = useState(allContacts);
  const [added, setAdded] = useState(true);

  const {addContact, getContacts} = useGlobalContext();
  const { toast } = useToast();

  useEffect(()=>{
    if (added)
      getContacts(props.loanId).then(res=>{
        if (res.status!=200)
          return;
        //console.log("contacts reponse",res)
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
      data["AID"]=props.AID;
      data["_loanId"]= props.loanId;

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

  const editContact = async (userValues:any) =>{
    const data=userValues;

    //console.log("inside edit, oldValues", userValues);

    /* const oldValues ={}// contacts[]

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
    } */
    if (Object.keys(data).length==0)
      return 200;

    data["AID"]=props.AID;
    data["_loanId"]=props.loanId;
    data["_contactId"]=userValues._id

    //console.log("submitted data", data)
    const res = await addContact(data,"EDIT");
    if (res==200){
      setAdded(true);
    }
    
    return res;
  }

  return(
    <div className="mt-8">
      <div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search" className="mx-5" />
        </div>

        <div className="flex-auto">
          <Filter value={role} setValue={setRole} options={[allContacts].concat(ContactTypeList)}/>
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
          ?role==allContacts && Object.keys(contacts).length!=0
            ?Object.keys(contacts).map((category,categoryIndex)=>{
              return contacts[category].map((person:FieldValues,index:number)=>{
                const regEx = new RegExp(searchString, "i");
                if (searchString=="" || (person.PN+"").search(regEx)!==-1)
                return <ContactCard key={categoryIndex+"_"+index} index={index} person={person} editFunction={editContact} formFields={fieldList} />
              })
            })
            :(contacts[role] && contacts[role].length>0)
              ?contacts[role].map((person:any,index:number)=>{
                const regEx = new RegExp(searchString, "i");
                if (searchString=="" || (person.PN+"").search(regEx)!==-1)
                  return <ContactCard key={index} index={index} person={person} editFunction={editContact} formFields={fieldList} />
                })
              :<EmptyPageMessage sectionName={role!=allContacts?role.toLowerCase()+"s":"contacts"} />
          :<LoadingMessage sectionName="contacts" />
        }
      </div>
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

function ContactCard(props:{index:number, person:FieldValues, editFunction:Function, formFields:FieldAttributesList }){
  const [billingAddress, setBillingAddress] = useState<ReactElement>();
  const [registeredAddress, setRegisteredAddress] = useState<ReactElement>();

  const constructAddresses = () => {
    const addressPieces = ["A","C","S","CC","P"];

    const baArr:string[] = [];
    for (let i=0; i<addressPieces.length; i++){
      if (props.person[`B${addressPieces[i]}`])
        baArr.push(props.person[`B${addressPieces[i]}`])
    }
    if (baArr.length==0)
      setBillingAddress(<span>N/A</span>);
    else
      setBillingAddress(
        <div className="">
          {baArr.map((ele,index)=>{
            if (index==baArr.length-1)
              return <span key={index}>{ele}</span>
            return<span key={index}>{ele}, </span>
          })}
        </div>
      );
    
    const raArr:string[] = [];
    for (let i=0; i<addressPieces.length; i++){
      if (props.person[`R${addressPieces[i]}`])
        raArr.push(props.person[`R${addressPieces[i]}`])
    }
    if (raArr.length==0)
      setRegisteredAddress(<span>N/A</span>);
    else
      setRegisteredAddress(
        <div className="">
          {raArr.map((ele,index)=>{
            if (index==raArr.length-1)
              return <span key={index}>{ele}</span>
            return<span key={index}>{ele}, </span>
          })}
        </div>
      );
  }
  
  useEffect(()=>{
    constructAddresses();
  },[props])
  return (
    <Card key={props.index+props.person.CT} className="m-5 w-72 rounded-xl">
      <CardHeader>
        <CardTitle>	
          <div className="flex flex-row">
            <div className="flex-auto">
              <ProfileIcon name={props.person.PN} size="small" />
            </div>
            <div className="">
              <div className="flex flex-row">
              <FormDialog key={props.index} index={props.index} edit={true} type="cont"
                triggerText={<Edit2Icon size={"20px"}/>} formSize="large"
                formTitle="Edit Contact" formSubmit={props.editFunction} submitButton="Edit Contact"
                form={props.formFields} currentFields={props.person}
              />
              <div className="ml-2">
              <Dialog>
                <DialogTrigger><CircleUserIcon/></DialogTrigger>
                <DialogContent className="bg-white min-w-[700px] min-h-[300px]">
                  <DialogHeader>
                    <DialogTitle>
                      <div className="flex flex-row">
                        <ProfileIcon name={props.person.PN} size="small" />
                        <div className="px-3">
                          <p className="my-1 font-normal text-custom-1">{props.person.PN || "person_name"}</p>
                          <p className="font-light text-base">{props.person.D}</p>
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-rows-5 grid-flow-col w-full">
                    <div className="m-5">
                      <p className="font-medium">{props.person.PN || "N/A"}</p>
                      <p className="font-light">Contact Person Name</p>
                    </div>

                    <div className="m-5">
                      <p className="font-medium">{props.person.D || "N/A"}</p>
                      <p className="font-light">Designation</p>
                    </div>
                    
                    <div className="m-5">
                      <p className="font-medium">{props.person.CE || "N/A"}</p>
                      <p className="font-light">Email</p>
                    </div>

                    <div className="m-5">
                      <p className="font-medium">{props.person.MN || "N/A"}</p>
                      <p className="font-light">Mobile Number</p>
                    </div>

                    <div className="m-5">
                      <p className="font-medium">{props.person.LN || "N/A"}</p>
                      <p className="font-light">Landline Number</p>
                    </div>

                    <div className="m-5">
                      <div className="font-medium">
                        {registeredAddress}
                      </div>
                      <p className="font-light">Registered Address</p>
                    </div>

                    <div className="m-5">
                      <div className="font-medium">
                        {billingAddress}
                      </div>
                      <p className="font-light">Billing Address</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-left">
        <p className="font-medium">{props.person.PN || "person_name"}</p>
        <p className="font-light">{props.person.CE || "email"}</p>
        <p className="font-light">{props.person.CT}</p>     
        <br/>
      </CardContent>
    </Card>
  )
}

export default LoanContactDetails;