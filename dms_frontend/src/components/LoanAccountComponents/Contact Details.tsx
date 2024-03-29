import { useState } from "react";
import { EllipsisVertical } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";

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
            <DialogTrigger className="p-3 w-36 bg-custom-1 text-white mt-2 rounded-xl">+ Add Contact</DialogTrigger>
            <DialogContent className="bg-white min-w-[600px] min-h-[400px] rounded-xl border-none">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Contact</DialogTitle>
                <hr/>
                <DialogDescription>
                  <form onSubmit={createContact}>
                    <div className="grid grid-rows-5 grid-flow-col w-full">
                      <div className="m-5">
                        <label htmlFor="type" className="text-lg">Choose</label>
                        <br/>
                        <input type="text" id="type" onChange={e=>setPersonType(e.target.value)} className="border-2 rounded-xl p-3"/>  
                      </div>
        
                      <div className="m-5">
                        <label htmlFor="cname" className="text-lg">Company Name</label>
                        <br/>
                        <input type="text" id="cname" onChange={e=>setCompany(e.target.value)} className="border-2 rounded-xl p-3"/>  
                      </div>

                      <div className="m-5">
                        <label htmlFor="person" className="text-lg">Contact Person Name</label>
                        <br/>
                        <input type="text" id="person" onChange={e=>setName(e.target.value)} className="border-2 rounded-xl p-3"/>  
                      </div>

                      <div className="m-5">
                        <label htmlFor="designation" className="text-lg">Designation</label>
                        <br/>
                        <input type="text" id="designation" onChange={e=>setDesignation(e.target.value)} className="border-2 rounded-xl p-3"/>  
                      </div>

                      <div className="m-5">
                        <label htmlFor="email" className="text-lg">Email Address</label>
                        <br/>
                        <input type="email" id="email" onChange={e=>setEmail(e.target.value)} className="border-2 rounded-xl p-3"/>  
                      </div>

                      <div className="m-5">
                        <label htmlFor="mention" className="text-lg">Mention</label>
                        <br/>
                        <select id="mention" onChange={(e:any)=>setMention(e.target.value)} className="bg-white border-2 rounded-xl p-3">
                          <option value={0}>To</option>
                          <option value={1}>Cc</option>
                        </select>
                      </div>                      

                      <div className="m-5">
                        <label htmlFor="landline" className="text-lg">Landline Number</label>
                        <br/>
                        <input type="text" id="landline" onChange={e=>setLandline(e.target.value)} className="border-2 rounded-xl p-3"/>  
                      </div>

                      <div className="m-5">
                        <label htmlFor="mobile" className="text-lg">Mobile Number</label>
                        <br/>
                        <input type="text" id="mobile" onChange={e=>setMobile(e.target.value)} className="border-2 rounded-xl p-3"/>  
                      </div>

                      <div className="m-5">
                        <label htmlFor="reg" className="text-lg">Registered Address</label>
                        <br/>
                        <input type="text" id="reg" onChange={e=>setRegAddress(e.target.value)} className="border-2 rounded-xl p-3"/>  
                      </div>

                      <div className="m-5">
                        <label htmlFor="bill" className="text-lg">Billing Address</label>
                        <input type="text" id="bill" onChange={e=>setBillAddress(e.target.value)} className="border-2 rounded-xl p-3"/>  
                      </div>

                    </div>
                    <button type="submit" className="float-right h-12 p-4 rounded-lg mt-9 bg-custom-1 text-white">Add User</button>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
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
                        <div style={{height:"100px", width:"100px", lineHeight:"100px", borderRadius:"50%", textAlign:"center", fontSize:"30px", backgroundColor: "goldenrod", color:"white"}}>{person[0].split(" ").map((name:String)=>{return name[0]})}</div>
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
                    <div style={{height:"70px", width:"70px", lineHeight:"70px", borderRadius:"50%", textAlign:"center", fontSize:"21px", backgroundColor: "goldenrod", color:"white"}}>{person[0].split(" ").map((name:String)=>{return name[0]})}</div>
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