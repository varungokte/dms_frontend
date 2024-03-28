import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";

import { EllipsisVertical } from "lucide-react";

function ContactDetails() {
  //contacts is an object where the keys are the categories (like borrower, lender, promoter) and values are arrays of people
  //Each person is an array: [Name, Designation, Landline Number, Mobile Number, Email, Regitered Address, Billing Address]
  const [contacts, setContacts] = useState({
    "Borrower": [["Ben Quadinaros", "Podracer", "123", "123","email@email", "ABC", "ABC"],
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
			<p className="text-2xl font-bold mx-7 mb-5">Contact Details</p>
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
            <DialogTrigger className="mx-10 my-3 text-white p-3 rounded-xl bg-violet-800">+ Add User</DialogTrigger>
            <DialogContent className="bg-white min-w-[600px] min-h-[400px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add User</DialogTitle>
                <hr/>
                <DialogDescription>
                  <form onSubmit={createContact}>
                    <label htmlFor="type" className="text-lg">Type</label>
                    <br/>
                    <input id="type" onChange={(e)=>setPersonType(e.target.value)} className="border-2 rounded-xl w-full h-10 p-3"/>
                    <br/>
                    <br/>
                    <div className="grid grid-rows-2 grid-flow-col w-full">
                      <div>
                        <label htmlFor="email" className="text-lg">Email Address</label>
                      </div>

                      <div>
                        <input type="email" onChange={e=>setEmail(e.target.value)} className="border-2 rounded-xl w-4/5 p-3"/>  
                      </div>

                      <div>
                        <label htmlFor="role" className="text-lg">User Role</label>
                      </div>                      

                      <div>
                        <select id="role" onChange={(e:any)=>setName(e.target.value)} className="bg-white border-2 rounded-xl w-4/5 p-3">
                          <option value={2}>Admin</option>
                          <option value={0}>Maker</option>
                          <option value={1}>Checker</option>
                        </select>
                      </div>
                    </div>
                    <br/>
                    <br/>

                    <div className="grid grid-rows-2 grid-flow-col w-full">
                      <div>
                        <label htmlFor="password" className="text-lg">Password</label>
                      </div>

                      <div>
                        <input type="password" onChange={e=>setName(e.target.value)} className="border-2 rounded-xl w-4/5 p-3"/>
                      </div>

                      <div className="ml-9">
                        <label htmlFor="permission" className="text-lg">Permissions</label>
                      </div>                      

                      <div className="flex m-auto">
                        <div className="mx-5">
                          <input type="checkbox" id="verify" className="mr-1"/><label htmlFor="verify">Verify</label>
                        </div>
                        <div className="mx-5">
                          <input type="checkbox" id="read" className="mr-1"/><label htmlFor="read">Read</label>
                        </div>
                        </div>
                    </div>
                    <button type="submit" className="float-right h-12 p-4 rounded-lg mt-9 bg-violet-800 text-white">Add User</button>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
            </Dialog>
          <button className="p-3 w-36 bg-violet-800 text-white mt-2 rounded-xl">Add Contact</button>
        </div>
      </div>
      <div className="flex flex-row flex-wrap m-7">
      {//@ts-ignore
        contacts[role].map(person=>{
          return(
            <Card className="m-5 w-60 rounded-xl">
              <CardHeader>
                <CardTitle>	
                  <div className="flex flex-row">
                    <div className="flex-auto">
                      <div style={{height:"100px", width:"100px", lineHeight:"100px", borderRadius:"50%", textAlign:"center", fontSize:"30px", backgroundColor: "goldenrod", color:"white"}}>{person[0].split(" ").map((name:String)=>{return name[0]})}</div>
                    </div>
                    <div className=""><EllipsisVertical/></div>
                  </div>
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{person[0]}</p>
                <p className="font-light">{person[1]}</p>
              </CardContent>
              <CardFooter>
                <p>{role}</p>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    <br/>
  </div>
  )
}

export default ContactDetails;