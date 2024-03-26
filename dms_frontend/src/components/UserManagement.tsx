import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

function UserManagement(){
  //userData is an array of users
  //Each user is an array with: [Name, Email, Company Name, Role, Status]
  //Role can be maker(0), checker(1), admin (2), superadmin (3)
  //Status can be inactive(0) or active(1)
  const [userData]= useState([
    ["Bruce Wayne", "bw@email.com", "Wayne Enterprises", 2,1],
    ["Mark Scout", "email@email.com", "Lumon", 1,1],
    ["Nix Card", "email123@email,com", "Inter-Galactic Banking Clan", 2, 0 ],
    ["Wile E. Cayote", "example@email.com", "Acme Corporation", 1, 0],
    ["Lucius Fox", "email@email.com", "Wayne Enterprises", 2, 1],
    ["Oliver Queen", "oq@email.com", "Queen Consolidated", 2, 1],
    ["Helena Eagan", "he@email.com", "Lumon", 2, 0]
  ]);

  const [companyFilter, setCompanyFilter] = useState("-1");
  const [roleFilter, setRoleFilter] = useState(-1);
  const [searchString, setSearchString] = useState("")

  const companyList: any[]=[];
  for (let i=0; i<userData.length; i++)
    //@ts-ignore
    if (!companyList.includes(userData[i][2]))
      companyList.push(userData[i][2]);
  
  enum Roles {
    "Maker", "Checker", "Admin", "Superadmin"
  }

  enum Status {
    "Inactive","Active"
  }

  enum StatusStyling {
    "text-red-600 bg-red-100",
    "text-green-600 bg-green-100",
  }

  return(
    <div>
			<p className="text-3xl font-bold m-7">User Management</p>
      <div className="flex flex-row relative">
        <div className=''>
          <input type="text" className="border-2 mx-10 my-2 rounded-xl p-5" placeholder="Search"/>
        </div>
        
        <div className="mr-7">
          <select className="bg-white border-2 p-6 mt-1 rounded-xl" onChange={(e:any)=>{setCompanyFilter(e.target.value)}}>
            <option value="-1">Company Name</option>
            {
            companyList.map((company,index)=>{
              return(
                <option value={company}>{company}</option>
              )
            })}
            </select>
        </div>

        <div>
          <select className="bg-white border-2 p-6 mt-1 rounded-xl" onChange={(e:any)=>{setRoleFilter(e.target.value)}}>
            <option value="-1">Role</option>
            {
            [0,1,2,3].map((num,ind)=>{
              return(
                <option value={ind}>{Roles[num]}</option>
              )
            })}
            </select>
        </div>

        <div className="absolute top-0 right-0">
          <select className="bg-white border-2 p-6 mt-1 rounded-xl">
            <option value="-1">Role</option>
            {
            [0,1,2,3].map((num,ind)=>{
              return(
                <option value={ind}>{Roles[num]}</option>
              )
            })}
            </select>
        </div>
      </div>
      <div className="m-7">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {userData.map(user=>{
                if ((companyFilter=="-1" || companyFilter==user[2]) && (roleFilter==-1 || roleFilter==user[3]))
                return (
                  <TableRow>
                    <TableCell>{user[0]}</TableCell>
                    <TableCell>{user[1]}</TableCell>
                    <TableCell>{user[2]}</TableCell>
                    <TableCell>{Roles[Number(user[3])]}</TableCell>
                    <TableCell><div className={`${StatusStyling[Number(user[4])]} text-center rounded-lg`}>{Status[Number(user[4])]}</div></TableCell>
                    <TableCell>Ellipsis</TableCell>
                </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default UserManagement;