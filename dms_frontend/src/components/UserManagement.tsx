import { useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogTrigger, } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

import { StatusValues, StatusStyling } from "./BasicComponents/Status";
import PurpleButtonStyling from "./BasicComponents/PurpleButtonStyling";
import DialogForm from "./BasicComponents/DialogForm";
import Search from "./BasicComponents/Search";
import Roles from "./BasicComponents/Roles";

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
  
  const createUser = () => {

  }

  return(
    <div>
			<p className="text-3xl font-bold m-7">User Management</p>
      <div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search Users"/>
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
            {Object.keys(Roles).filter(v=>!isNaN(Number(v))).map((num:any)=>{
              return <option value={num}>{Roles[num]}</option>
            })}
          </select>
        </div>

        <div className="">
          <Dialog>
            <DialogTrigger className={PurpleButtonStyling}>Add a User</DialogTrigger>
            <DialogForm 
              trigger="+ Add User" 
              title="Add User" 
              formSubmit={createUser} 
              submitButton="Add User"
              //category can be: single (entire line is one input field) or grid
              //if grid, it will fields, whose value is an array of object; each object is a field
              form={[
                {
                  category: "single",
                  label: "Name",
                  type: "text",
                  setter: setNewName
                },
                
                {
                  category: "grid",
                  number: 2,
                  fields:
                  [
                    {
                      label: "Email",
                      type: "email",
                      setter: setNewEmail
                    },
                    {
                      label: "Password",
                      type: "password",
                      setter: setNewPassword
                    },
                    {
                      label: "Role",
                      type: "select",
                      setter: setNewRole,
                      options: ["Admin", "Maker", "Checker"]
                    },
                    {
                      label: "Permissions",
                      type:"subgrid",
                      fields: [
                        {
                          label: "Verify",
                          type: "checkbox",
                          setter: setNewPermission,
                        },
                        {
                          label: "Read",
                          type: "checkbox",
                          setter: setNewPermission
                        }
                      ]
                    }
                  ]
                }
              ]}
              />
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
                  <TableCell><div className={`${StatusStyling[Number(user[4])]} text-center rounded-lg`}>{StatusValues[Number(user[4])]}</div></TableCell>
                  <TableCell>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger>{<Ellipsis className="ml-5"/>}</DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem>
                            <DialogTrigger>Edit User</DialogTrigger>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogForm 
                        title="Edit User" 
                        formSubmit={createUser} 
                        submitButton="Edit User"
                        //category can be: single (entire line is one input field) or grid
                        //if grid, it will fields, whose value is an array of object; each object is a field
                        form={[
                          {
                            category: "single",
                            label: "Name",
                            type: "text",
                            setter: setNewName
                          },
                          
                          {
                            category: "grid",
                            number: 2,
                            fields:
                            [
                              {
                                label: "Email",
                                type: "email",
                                setter: setNewEmail
                              },
                              {
                                label: "Role",
                                type: "select",
                                setter: setNewRole,
                                options: ["Admin", "Maker", "Checker"]
                              },
                              {
                                label: "Permissions",
                                type:"subgrid",
                                fields: [
                                  {
                                    label: "Verify",
                                    type: "checkbox",
                                    setter: setNewPermission,
                                  },
                                  {
                                    label: "Read",
                                    type: "checkbox",
                                    setter: setNewPermission
                                  }
                                ]
                              }
                            ]
                          }
                        ]}/>
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