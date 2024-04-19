import { useState } from "react";
import { EllipsisVertical } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import PurpleButtonStyling from "../BasicComponents/PurpleButtonStyling";
import ProfileIcon from "../BasicComponents/ProfileIcon";
import Filter from "../BasicComponents/Filter";
import Search from "../BasicComponents/Search";
import FormDialog from "../BasicComponents/FormDialog";

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
  const [personType, setPersonType] = useState("");
  const [mention, setMention] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [landline, setLandline] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [billAddress, setBillAddress] = useState("");

  const createContact = () => {

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
            triggerText="+ Add Contact"
            triggerClassName={PurpleButtonStyling}
            formTitle="Add New Contact"
            formSubmit={createContact}
            submitButton="Add User"
            form = {[
              { category: "grid", row:2, fields: [
                { type: "select", label: "Contact Type", setter: setPersonType, options: ["Borrower", "Lender"] },
                { type:"select", label: "Email Recipient Type", setter: setMention, options: ["To", "Cc","Bcc"] },
                { type:"text", label: "Company Name", setter: setCompany },
                { type:"text", label: "Landline Number", setter: setLandline },
                { type:"text", label: "Contact Person Name", setter: setName },
                { type:"text", label: "Mobile Number", setter: setMobile },
                { type:"text", label: "Designation", setter: setDesignation },
                { type:"text", label: "Registered Address", setter: setRegAddress },
                { type:"email", label: "Email Address", setter: setEmail }, 
                { type:"text", label: "Billing Address",setter: setBillAddress }
              ]}
            ]} 
          />
        </div>
      </div>
      <div className="  ">
      {//@ts-ignore
        contacts[role].map((person,index)=>{
          const regEx = new RegExp(searchString, "i");
          if (searchString=="" || (person[0]+"").search(regEx)!==-1)
          return(
            <Dialog>
            <DialogTrigger>
              <Card className="m-5 w-72 rounded-xl">
                <CardHeader>
                  <CardTitle>	
                    <div className="flex flex-row">
                      <div className="flex-auto">
                        <ProfileIcon name={person[0]} size="small" />
                      </div>
                      <div className=""><EllipsisVertical/></div>
                    </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-left">
                  <p className="font-medium">{person[0]}</p>
                  <p className="font-light">{person[4]}</p>
                  <p className="font-light">{role}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
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

                <div></div>

                <div className="m-5">
                  <p className="font-medium">{person[6]}</p>
                  <p className="font-light">Billing Address</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          )
        })}
      </div>
    <br/>
  </div>
  )
}

export default ContactDetails;