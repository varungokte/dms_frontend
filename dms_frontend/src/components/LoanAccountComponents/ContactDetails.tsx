import { useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";

import { EllipsisVertical } from "lucide-react";
import PurpleButtonStyling from "../BasicComponents/PurpleButtonStyling";
import ProfileIcon from "../BasicComponents/ProfileIcon";

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import FormDialog from "../BasicComponents/FormDialog";
import Filter from "../BasicComponents/Filter";
import Search from "../BasicComponents/Search";


function ContactDetails() {
  //contacts is an object where the keys are the categories (like borrower, lender, promoter) and values are arrays of people
  //Each person is an array: [Name, Designation, Landline Number, Mobile Number, Email, Regitered Address, Billing Address]
  const [contacts, setContacts] = useState({
    "Borrower": [["Ben Quadinaros", "Podracer", "123", "123","email@email", "221B Baker Street, London", "221B Baker Street, London"],
                ["Quinlan Vos", "Jedi Master", "456", "456", "example@email.com", "123 ABC", "123 ABC"],],
    "Lender": [["Cad Bane", "Bounty Hunter", "123", "123", "Email.com","1","2"]],
    "Lender's Agent": [["Wilhuff Tarkin", "Admiral", "1","2","email","a","b"],
                      ["Finis Valorum", "Supreme Chancellor", "1","2", "email", "A", "B"]],
  });

  const [searchString, setSearchString] = useState("");
  const [role, setRole] = useState("Borrower");

  const [name, setName] = useState("");
  const [contactType, setContactType] = useState("");
  const [recipient, setRecipient] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [landline, setLandline] = useState("");
  
  const [billBuilding, setBillBuilding] = useState("");
  const [billPincode, setBillPincode] = useState(-1);
  const [billCity, setBillCity] = useState("");
  const [billState, setBillState] = useState("");
  const [billCountry, setBillCountry] = useState("");
  
  const [addressesAreSame, setAddressesAreSame] = useState(false);

  const [regBulding, setRegBuilding] = useState("");
  const [regPincode, setRegPincode] = useState(-1);
  const [regCity, setRegCity] = useState("");
  const [regState, setRegState] = useState("");
  const [regCountry, setRegCountry] = useState("");
  
  const {addContact, getContacts} = useGlobalContext();

  useEffect(()=>{
    getContacts("662b7070bbe57c45023ce5fa").then(res=>{
      console.log(res)
    })
  },[])

  const createContact = (e:any) => {
    e.preventDefault();
    console.log("SUBMITTING DATA")
    const data = {
      "AID": "ACAERucpd",
      "_loanId": "662b7070bbe57c45023ce5fa",
      "CT": contactType,
      "CE": email,
      "RT": recipient,
      "CN": company,
      "D": designation,
      "PN": name,
      "MN": mobile,
      "LN": landline,

      "BA": billBuilding,
      "BP": billPincode,
      "BC": billCity,
      "BS": billState,
      "BCC": billCountry,

      "RA": regBulding,
      "RP": regPincode,
      "RC": regCity,
      "RS": regState,
      "RCC": regCountry
    }

    addContact(data).then(res=>{
      console.log("ZZZZZZZZZZZZZZZZZZZZZZZZ",res)
    })
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
            triggerText="+ Add Contact" triggerClassName={PurpleButtonStyling} formSize="large"
            formTitle="Add New Contact"  formSubmit={createContact} submitButton="Add User"
            form = {[
              { category: "grid", row:3, sectionName:"", fields: [
                { type: "select", label: "Contact Type", setter: setContactType, options: ["Borrower", "Lender"] },
                { type:"email", label: "Email Address", setter: setEmail }, 
                { type:"select", label: "Email Recipient Type", setter: setRecipient, options: ["To", "Cc","Bcc"] },
                { type:"text", label: "Company Name", setter: setCompany },
                { type:"text", label: "Designation", setter: setDesignation },
                { type:"text", label: "Contact Person Name", setter: setName },
                { type:"text", label: "Mobile Number", setter: setMobile },
                { type:"text", label: "Landline Number", setter: setLandline },
              ]},
              { category: "grid", row: 2, sectionName:"Billing Address", customWidth:'[70%_auto]', fields:[
                { type:"text", label: "Bulding/Street/Locality Name", setter: setBillBuilding },
                { type:"number", label: "Pincode",setter: setBillPincode },
              ]},
              { category:"grid", row: 3, fields:[
                { type:"text", label: "Country",setter: setBillCountry },
                { type:"text", label: "State",setter: setBillState },
                { type:"text", label: "City",setter: setBillCity },
              ]}, 
              { category: "grid", row: 2, sectionName:"Registered Address", customWidth:'[70%_auto]', fields:[
                { type:"text", label: "Bulding/Street/Locality Name", setter: setRegBuilding },
                { type:"number", label: "Pincode",setter: setRegPincode },
              ]},
              { category: "grid", row: 3, fields:[
                { type:"text", label: "Country",setter: setRegCountry },
                { type:"text", label: "State",setter: setRegState },
                { type:"text", label: "City",setter: setRegCity },
              ]},
            ]} 
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
                      <Dialog>
                        <DropdownMenuTrigger><EllipsisVertical/></DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem>
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
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FormDialog
                          triggerText={"Edit"}  formSize="large"
                          formTitle="Add New Contact"  formSubmit={createContact} submitButton="Add User"
                          form = {[
                            { category: "grid", row:3, sectionName:"", fields: [
                              { type: "select", label: "Contact Type", setter: setContactType, options: ["Borrower", "Lender"] },
                              { type:"email", label: "Email Address", setter: setEmail }, 
                              { type:"select", label: "Email Recipient Type", setter: setRecipient, options: ["To", "Cc","Bcc"] },
                              { type:"text", label: "Company Name", setter: setCompany },
                              { type:"text", label: "Designation", setter: setDesignation },
                              { type:"text", label: "Contact Person Name", setter: setName },
                              { type:"text", label: "Mobile Number", setter: setMobile },
                              { type:"text", label: "Landline Number", setter: setLandline },
                            ]},
                            { category: "grid", row: 3, sectionName:"Billing Address", fields:[
                              { type:"text", label: "Bulding/Street/Locality Name", setter: setBillBuilding, large: true },
                              { type:"number", label: "Pincode",setter: setBillPincode },
                              { type:"text", label: "Country",setter: setBillCountry },
                              { type:"text", label: "State",setter: setBillState },
                              { type:"text", label: "City",setter: setBillCity },
                            ]},
                            { category: "grid", row: 3, sectionName:"Registered Address", fields:[
                              { type:"text", label: "Bulding/Street/Locality Name", setter: setRegBuilding, large: true },
                              { type:"number", label: "Pincode",setter: setRegPincode },
                              { type:"text", label: "Country",setter: setRegCountry },
                              { type:"text", label: "State",setter: setRegState },
                              { type:"text", label: "City",setter: setRegCity },
                            ]},
                          ]} 
                          />
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </Dialog>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p className="font-medium">{person[0]}</p>
                <p className="font-light">{person[4]}</p>
                <p className="font-light">{role}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    <br/>
  </div>
  )
}

export default ContactDetails;