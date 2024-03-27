import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"


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
  const [role, setRole] = useState("Borrower")

  return(
    <div className="bg-white rounded-xl">
			<p className="text-2xl font-bold m-7 mt-5">Contact Details</p>
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
          <button className="p-3 w-36 bg-violet-800 text-white mt-2 rounded-xl">Add Contact</button>
        </div>
      </div>
      <div className="flex flex-row flex-wrap m-7">
      {//@ts-ignore
        contacts[role].map(person=>{
          return(
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
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