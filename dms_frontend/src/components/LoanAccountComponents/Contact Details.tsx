import { useState } from "react";
import { EllipsisVertical } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import PurpleButtonStyling from "../BasicComponents/PurpleButtonStyling";
import DialogForm from "../BasicComponents/FormDialog";
import ProfileIcon from "../BasicComponents/ProfileIcon";

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
    <div className="bg-white rounded-xl">
      <br/>
			<p className="text-2xl font-bold mx-7 mb-2">Contact Details</p>
      <hr/>

      <div className="flex flex-row">
        <div className=''>
          <input type="text" className="border-2 mx-10 p-3 rounded-xl my-2 w-72" 
          onChange={(e)=>{
            const val = e.target.value+"";
            setSearchString(val.replace("\\", "/\\/"))
          }} 
          placeholder="Search"/>
        </div>

        <div className="flex-auto">
          <select className="bg-white border-2 p-3 rounded-xl mt-2 w-60" onChange={(e:any)=>setRole(e.target.value)}>
            {Object.keys(contacts).sort().map(category=>{
              return(
                <option value={category}>{category}</option>
              )
            })}
          </select>
        </div>
      
        <div className="mr-3">
          <Dialog>
            <DialogTrigger className={PurpleButtonStyling}>+ Add Contact</DialogTrigger>
            <DialogForm
              title="Add New Contact"
              formSubmit={createContact}
              submitButton="Add User"
              form = {[
                { category: "grid", number: 0, fields: [
                  { type: "text", label: "Choose", setter: setPersonType },
                  { type:"text", label: "Company Name", setter: setCompany },
                  { type:"text", label: "Contact Person Name", setter: setName },
                  { type:"text", label: "Designation", setter: setDesignation },
                  { type:"email", label: "Email Address", setter: setEmail },
                  { type:"select", label: "Mention", setter: setMention, options: ["To", "CC"] },
                  { type:"text", label: "Landline Number", setter: setLandline },
                  { type:"text", label: "Mobile Number", setter: setMobile },
                  { type:"text", label: "Registered Address", setter: setRegAddress },
                  { type:"text", label: "Company Name", setter: setCompany },
                  { type:"text", label: "Billing Address",setter: setBillAddress }
                ]}
              ]} 
              />
            </Dialog>
        </div>
      </div>
      <div className="flex flex-row flex-wrap m-7">
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
                        <ProfileIcon name={person[0]}/>
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
                      <ProfileIcon name={person[0]}/>
                    <div className="p-3">
                      <p className="my-1 font-normal text-custom-1">{person[0]}</p>
                      <p className="font-light text-base">{person[1]}</p>
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription className="">
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
                </DialogDescription>
              </DialogHeader>
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