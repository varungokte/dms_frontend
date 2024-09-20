import { ReactElement, useContext, useEffect, useState } from "react";
import { FieldValues, ToastOptionsAttributes } from "@/types/DataTypes";
import { LoanCommonProps } from "@/types/ComponentProps";
import { FieldAttributesList } from "@/types/FormAttributes";

import { MasterValuesContext, PermissionContext } from "@/Contexts";
import { addContact, deleteContact, getContactsList, getSingleContact } from "@/apiFunctions/contactAPIs";
import { getModSecName } from "@/functions/sectionNameAttributes";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Menu from '@mui/material/Menu';

import Filter from "../BasicComponents/Filter";
import FormDialog from "../FormComponents/FormDialog";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import EmptyPageMessage from "../BasicMessages/EmptyPageMessage";
import LoadingMessage from "../BasicMessages/LoadingMessage";
import Toast from "../BasicComponents/Toast";
import SearchByType from "../BasicComponents/SearchByType";
import AddButton from "../BasicButtons/AddButton";

import ProfileIcon from "../BasicComponents/ProfileIcon";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteConfirmation from "../BasicComponents/DeleteConfirmation";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from "@mui/material/Button";

function LoanContactDetails(props:LoanCommonProps) {
  const allContacts = "All Contacts";
  const [contacts, setContacts] = useState<{[key:string]:FieldValues}>();

  const {userPermissions} = useContext(PermissionContext);
  
  const masters = useContext(MasterValuesContext);

  if (!masters) return;

  const { ContactTypeList, EmailRecipientList } = masters;
  
  const fieldList: FieldAttributesList = [
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
      { id: "BP", type:"integer", name: "Pincode", suppressCommas:true },
    ]},
    { category:"grid", row: 3, fields:[
      { id: "BCC", type:"text", name: "Country" },
      { id: "BS", type:"text", name: "State" },
      { id: "BC", type:"text", name: "City" },
    ]}, 
    { category:"single", id:"add-same", type:"checkbox", name:"Billing and Registered Addresses are the same", hideOnEdit:true },
    { category: "grid", row: 2, sectionName:"Registered Address", sectionClassName:"text-2xl font-medium my-2", customWidth:'[70%_30%]', fields:[
      { id: "RA", type:"text", name: "Bulding/Street/Locality Name" },
      { id: "RP", type:"integer", name: "Pincode", suppressCommas:true },
    ]},
    { category: "grid", row: 3, fields:[
      { id: "RCC", type:"text", name: "Country" },
      { id: "RS", type:"text", name: "State" },
      { id: "RC", type:"text", name: "City" },
    ]},
  ];

  const [addOpen, setAddOpen] = useState([false]);

  const [searchString, setSearchString] = useState("");
  const [searchType, setSearchType] = useState("");
  const searchOptions = [{label:"Name", value:"PN"}, {label:"Email", value:"E"},{label:"Company Name", value:"CN"}];

  const [role, setRole] = useState(allContacts);
  const [added, setAdded] = useState(true);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
 
  useEffect(()=>{
    setAdded(true);
  },[searchString,searchType]);

  useEffect(()=>{
    if (added)
      getContactsList({loanId:props.loanId, searchString, searchType}).then(res=>{
        if (res.status!=200)
          return;
        console.log("contacts reponse",res)
        const obj:any={};
        res.data[0]["data"].map((contact:any)=>{
          //console.log("contact",contact)
          if (contact.CT=="-")
            return;
          if (obj[contact.CT])
            obj[contact.CT].push(contact);  
          else
            obj[contact.CT] = [contact];
        });
        
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

      const res = await addContact(data);
      
      if (res==200){
        setAdded(true);
        setToastOptions({open:true, type:"success", action:"add", section:"Contact"});
      }
      else
        setToastOptions({open:true, type:"error", action:"add", section:"Contact"});
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
    data["_contactId"]=userValues._id;
    
    //console.log("submitted data", data)
    const res = await addContact(data);
    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"add", section:"Contact"});
    }
    else
      setToastOptions({open:true, type:"error", action:"add", section:"Contact"});
    
    return res;
  }

  const obliterateContact = async(id:string) => {
    const res = await deleteContact(id);
    //console.log("delete",res);
    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"delete", section:"Contact"});
    }
    else
      setToastOptions({open:true, type:"error", action:"delete", section:"Contact"});
  }

  return(
    <div className="mt-8">
      <div className="flex flex-row">
        <div className="m-auto">
        <SearchByType className="mx-5" searchString={searchString} setSearchString={setSearchString} searchType={searchType} setSearchType={setSearchType} typeOptions={searchOptions}  />
        </div>

        <div className="m-auto flex-auto">
          <Filter value={role} setValue={setRole} options={[allContacts].concat(ContactTypeList)}/>
        </div>
      
        <div className="mr-3">
          {props.actionType!="VIEW" && userPermissions["loan"].includes("add") && userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("add")
            ?<div>
              <AddButton sectionName="contact" onClick={()=>setAddOpen([true])} />
              {addOpen[0]
                ?<FormDialog key={0} index={0} edit={false} type="cont"
                  formOpen={addOpen[0]} setFormOpen={setAddOpen} formSize="lg"
                  formTitle="Add New Contact" formSubmit={createContact} submitButton="Add Contact"
                  form={fieldList} currentFields={{}}
                />
                :<></>
              }
            </div>
            :<></>
          }
        </div>  
      </div>
      <div className="flex flex-row flex-wrap">
        {contacts
          ?role==allContacts && Object.keys(contacts).length!=0
            ?Object.keys(contacts).map((category,categoryIndex)=>{
              return contacts[category].map((person:FieldValues,index:number)=>{
                return <ContactCard key={categoryIndex+"_"+index} index={index} person={person} editFunction={editContact} formFields={fieldList} actionType={props.actionType} userPermissions={userPermissions} deleteFunction={obliterateContact} />
              })
            })
            :(contacts[role] && contacts[role].length>0)
              ?contacts[role].map((person:any,index:number)=>{
                return <ContactCard key={index} index={index} person={person} editFunction={editContact} formFields={fieldList} actionType={props.actionType} userPermissions={userPermissions} deleteFunction={obliterateContact} />
              })
              :<EmptyPageMessage sectionName={role!=allContacts?role.toLowerCase()+"s":"contacts"} />
          :<LoadingMessage sectionName="contacts" />
        }
      </div>
      <br/>
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} sectionCount={props.sectionCount} goToPreviousSection={props.goToPreviousSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

function ContactCard(props:{index:number, person:FieldValues, editFunction:Function, formFields:FieldAttributesList, actionType:"CREATE"|"EDIT"|"VIEW", userPermissions:any, deleteFunction:Function }){
  return (
    <Card key={props.index+props.person.CT} className="m-5 w-72 rounded-xl" style={{borderRadius:"10px",padding:"5px"}} variant="outlined">
      <CardContent className="text-left">
        <div className="flex flex-row">
        {/* <CardActionArea disableRipple disableTouchRipple sx={{":hover":{backgroundColor:"white"}}}> */}
          <div className="flex-auto">
            <ProfileIcon name={props.person.PN} size="small" />
            <p className="font-medium">{props.person.PN || "person_name"}</p>
            <p className="font-light">{props.person.CE || "email"}</p>
            <p className="font-light">{props.person.CT}</p>     
          </div>

            <ContactActions {...props} />
        </div>
      </CardContent>
    </Card>
  )
}

function ContactActions(props:{index:number, person:FieldValues, editFunction:Function, formFields:FieldAttributesList, actionType:"CREATE"|"EDIT"|"VIEW", userPermissions:any, deleteFunction:Function }){
  const [openMenu, setOpenMenu] = useState(false);
  const [openView, setOpenView] = useState(false);  
  const [openEdit, setOpenEdit] = useState([false]);
  const [openDelete, setOpenDelete] = useState([false]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  }

  return (
    <div>
      <button onClick={handleClick}><MoreVertIcon fontSize="medium" /></button>
      {openMenu &&<Menu open={openMenu} onClose={handleClose} anchorEl={anchorEl}>
        {props.userPermissions && (props.userPermissions["loan"].includes("edit")||props.userPermissions["loan"].includes("view")) && props.userPermissions["contact"].includes("view")
          ?<div>
            <Button sx={{width:"100%", justifyContent:"flex-start"}} variant="text" color="info" startIcon={<AccountCircleIcon/>} onClick={()=>setOpenView(true)}>View</Button>
            {openView?<ViewContact personId={props.person["_id"]} open={openView} setOpen={setOpenView} />:<></>}
          </div>
          :<></>
        }
        {props.actionType!="VIEW" && props.userPermissions && props.userPermissions["loan"].includes("edit") && props.userPermissions["contact"].includes("edit")
          ?<div>
            <Button sx={{width:"100%", justifyContent:"flex-start"}} color="success" startIcon={<EditIcon/>} variant="text" onClick={()=>setOpenEdit([true])}>Edit</Button>
              {openEdit[0]
                ?<FormDialog key={props.index} index={0} edit type="cont"
                  formOpen={openEdit[0]} setFormOpen={setOpenEdit} formSize="lg"
                  formTitle="Edit Contact" formSubmit={props.editFunction} submitButton="Edit Contact"
                  form={props.formFields} currentFields={props.person}
                />
                :<></>
              }
            </div>
          :<></>
        }
        {props.actionType!="VIEW" && props.userPermissions && props.userPermissions["loan"].includes("edit") && props.userPermissions["contact"].includes("delete")
          ?<div>
            <Button sx={{width:"100%", justifyContent:"flex-start"}} color="error" variant="text" onClick={()=>setOpenDelete([true])} startIcon={<DeleteOutlineOutlinedIcon/>}>Delete</Button>
            {openDelete[0]?<DeleteConfirmation thing="contact" deleteFunction={props.deleteFunction} open={openDelete[0]} setOpen={setOpenDelete} currIndex={0} id={props.person["_id"]} />:<></>}
          </div>
          :<></>
        }
      </Menu>}
    </div>
  );
  
  /* return (
    <div className="flex flex-row">
      {props.actionType!="VIEW" && props.userPermissions && props.userPermissions["loan"].includes("edit") && props.userPermissions["contact"].includes("edit")
        ?<div>
          <button onClick={()=>props.setEditOpen((curr:boolean[])=>{curr[props.index]=true;return [...curr]})}><Edit2Icon size={"20px"}/></button>
          {props.editOpen[props.index]
            ?<FormDialog key={props.index} index={props.index} edit={true} type="cont"
              formOpen={props.editOpen[props.index]} setFormOpen={props.setEditOpen} formSize="lg"
              formTitle="Edit Contact" formSubmit={props.editFunction} submitButton="Edit Contact"
              form={props.formFields} currentFields={props.person}
            />
            :<></>
          }
        </div>
        :<></>
      }
      {props.userPermissions && (props.userPermissions["loan"].includes("edit")||props.userPermissions["loan"].includes("view")) && props.userPermissions["contact"].includes("view")
        ?<div className="ml-2">
          <button onClick={()=>setViewOpen(true)}><CircleUserIcon/></button>
          {viewOpen?<ViewContact personId={props.person["_id"]} open={viewOpen} setOpen={setViewOpen} />:<></>}
        </div>
        :<></>
      }
      {props.actionType!="VIEW" && props.userPermissions && props.userPermissions["loan"].includes("edit") && props.userPermissions["contact"].includes("delete")
        ?<div className="ml-2">
          <DeleteConfirmation thing="contact" deleteFunction={props.deleteFunction} currIndex={props.person["_id"]} icon={<DeleteOutlineOutlinedIcon/>} />
        </div>
        :<></>
      }
    </div>
  ) */
}

function ViewContact(props:{personId:string, open:boolean, setOpen:Function}){
  const [billingAddress, setBillingAddress] = useState<ReactElement>();
  const [registeredAddress, setRegisteredAddress] = useState<ReactElement>();
  const [personDetails, setPersonDetails] = useState<FieldValues>();

  useEffect(()=>{
    getSingleContact(props.personId).then(res=>{
      //console.log("SINGLE PERSON DATA",res);
      if (res.status==200)
        setPersonDetails(res.data);
      else
        setPersonDetails({});
    })
  },[])
  

  const constructAddresses = () => {
    if (!personDetails)
      return;

    const addressPieces = ["A","C","S","CC","P"];

    const baArr:string[] = [];
    for (let i=0; i<addressPieces.length; i++){
      if (personDetails[`B${addressPieces[i]}`])
        baArr.push(personDetails[`B${addressPieces[i]}`])
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
      if (personDetails[`R${addressPieces[i]}`])
        raArr.push(personDetails[`R${addressPieces[i]}`])
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
  },[personDetails]);

  if (!personDetails)
    return <></>

  return (
    <Dialog open={props.open} onClose={()=>props.setOpen(false)} fullWidth>
      <DialogTitle>
        <div className="flex flex-row">
          <ProfileIcon name={personDetails.PN} size="small" className="mt-2" />
          <div className="px-3">
            <p className="my-1 font-normal text-custom-1">{personDetails.PN || "person_name"}</p>
            <p className="font-light text-base">{personDetails.D}</p>
          </div>
        </div>
      </DialogTitle>
        <div className="grid grid-rows-5 grid-flow-col w-full">
          <div className="m-5">
            <p className="font-medium">{personDetails.PN || "N/A"}</p>
            <p className="font-light">Contact Person Name</p>
          </div>

          <div className="m-5">
            <p className="font-medium">{personDetails.D || "N/A"}</p>
            <p className="font-light">Designation</p>
          </div>
          
          <div className="m-5">
            <p className="font-medium">{personDetails.CE || "N/A"}</p>
            <p className="font-light">Email</p>
          </div>

          <div className="m-5">
            <p className="font-medium">{personDetails.MN || "N/A"}</p>
            <p className="font-light">Mobile Number</p>
          </div>

          <div className="m-5">
            <p className="font-medium">{personDetails.LN || "N/A"}</p>
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
    </Dialog>
  )
}

export default LoanContactDetails;