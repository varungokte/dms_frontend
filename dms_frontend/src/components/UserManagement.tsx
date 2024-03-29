import { useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";

import { Ellipsis } from "lucide-react";

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
  const [searchString, setSearchString] = useState("");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState(-1);
  const [newPassword, setNewPassword] = useState("");
  const [newPermission, setNewPermission] = useState(-1);

  const companyList: any[]=[];
  for (let i=0; i<userData.length; i++)
    //@ts-ignore
    if (!companyList.includes(userData[i][2]))
      companyList.push(userData[i][2]);
  
  enum Roles {
    "Maker", "Checker", "Admin", "Superadmin"
  };

  enum Status {
    "Inactive","Active"
  };

  enum StatusStyling {
    "text-red-600 bg-red-100",
    "text-green-600 bg-green-100",
  };

  const createUser = () => {

  }

  return(
    <div>
			<p className="text-3xl font-bold m-7">User Management</p>
      <div className="flex flex-row">
        <div className=''>
          <input type="text" className="border-2 mx-10 my-2 rounded-xl p-5" placeholder="Search" 
            onChange={e=>{
              const val = e.target.value+"";
              setSearchString(val.replace("\\", "/\\/"))
            }}/>  
        </div>
        
        <div className="mr-7">
          <select className="bg-white border-2 p-6 mt-1 rounded-xl" onChange={(e:any)=>{setCompanyFilter(e.target.value)}}>
            <option value="-1">Company Name</option>
            {
            companyList.map((company)=>{
              return(
                <option value={company}>{company}</option>
              )
            })}
            </select>
        </div>

        <div className="flex-auto">
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

        <div className="">
          <Dialog>
            <DialogTrigger className="mx-10 my-3 text-white p-3 rounded-xl bg-custom-1">+ Add User</DialogTrigger>
            <DialogContent className="bg-white min-w-[600px] min-h-[400px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add User</DialogTitle>
                <hr/>
                <DialogDescription>
                  <form onSubmit={createUser}>
                    <label htmlFor="name" className="text-lg">Name</label>
                    <br/>
                    <input id="name" onChange={(e)=>setNewName(e.target.value)} className="border-2 rounded-xl w-full h-10 p-3"/>
                    <br/>
                    <br/>
                    <div className="grid grid-rows-2 grid-flow-col w-full">
                      <div>
                        <label htmlFor="email" className="text-lg">Email Address</label>
                      </div>

                      <div>
                        <input type="email" onChange={e=>setNewEmail(e.target.value)} className="border-2 rounded-xl w-4/5 p-3"/>  
                      </div>

                      <div>
                        <label htmlFor="role" className="text-lg">User Role</label>
                      </div>                      

                      <div>
                        <select id="role" onChange={(e:any)=>setNewRole(e.target.value)} className="bg-white border-2 rounded-xl w-4/5 p-3">
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
                        <input type="password" onChange={e=>setNewPassword(e.target.value)} className="border-2 rounded-xl w-4/5 p-3"/>
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
                    <button type="submit" className="float-right h-12 p-4 rounded-lg mt-9 bg-custom-1 text-white">Add User</button>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
            </Dialog>
        </div>
      </div>
      <div className="m-7">
        <Table className="bg-white border-2 rounded-xl">
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
                const regEx = new RegExp(searchString, "i");
                if ((companyFilter=="-1" || companyFilter==user[2]) && (roleFilter==-1 || roleFilter==user[3]) && (searchString=="" || (user[0]+"").search(regEx)!==-1))
                return (
                  <TableRow>
                    <TableCell>{user[0]}</TableCell>
                    <TableCell>{user[1]}</TableCell>
                    <TableCell>{user[2]}</TableCell>
                    <TableCell>{Roles[Number(user[3])]}</TableCell>
                    <TableCell><div className={`${StatusStyling[Number(user[4])]} text-center rounded-lg`}>{Status[Number(user[4])]}</div></TableCell>
                    <TableCell>
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger><Ellipsis className="ml-5"/></DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem>
                              <DialogTrigger>Edit User</DialogTrigger>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent className="bg-white min-w-[600px] min-h-[400px]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">Edit User</DialogTitle>
                            <hr/>
                            <DialogDescription>
                              <form onSubmit={createUser}>
                                <label htmlFor="name" className="text-lg">Name</label>
                                <br/>
                                <input id="name" onChange={(e)=>setNewName(e.target.value)} className="border-2 rounded-xl w-full h-10 p-3"/>
                                <br/>
                                <br/>
                                <div className="grid grid-rows-2 grid-flow-col w-full">
                                  <div>
                                    <label htmlFor="email" className="text-lg">Email Address</label>
                                  </div>

                                  <div>
                                    <input type="email" onChange={e=>setNewEmail(e.target.value)} className="border-2 rounded-xl w-4/5 p-3"/>  
                                  </div>

                                  <div>
                                    <label htmlFor="role" className="text-lg">User Role</label>
                                  </div>                      

                                  <div>
                                    <select id="role" onChange={(e:any)=>setNewRole(e.target.value)} className="bg-white border-2 rounded-xl w-4/5 p-3">
                                      <option value={2}>Admin</option>
                                      <option value={0}>Maker</option>
                                      <option value={1}>Checker</option>
                                    </select>
                                  </div>
                                </div>
                                <br/>
                                <br/>

                                <div className="grid grid-rows-2 grid-flow-col w-full">
                                  <div className="ml-9">
                                    <label htmlFor="permission" className="text-lg">Permissions</label>
                                  </div>                      

                                  <div className="flex">
                                    <div className="mx-5">
                                      <input type="checkbox" id="verify" className="mr-1"/><label htmlFor="verify">Verify</label>
                                    </div>
                                    <div className="mx-5">
                                      <input type="checkbox" id="read" className="mr-1"/><label htmlFor="read">Read</label>
                                    </div>
                                    </div>
                                </div>
                                <button type="submit" className="float-right h-12 p-4 rounded-lg mt-9 bg-custom-1 text-white">Add User</button>
                              </form>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>

                    </TableCell>
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