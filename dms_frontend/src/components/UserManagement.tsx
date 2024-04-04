import { useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogTrigger, } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

import { UserStatusValues, UserStatusStyling, UserRoles, EnumIteratorValues, EnumIteratorKeys } from "./BasicComponents/Constants";
import PurpleButtonStyling from "./BasicComponents/PurpleButtonStyling";
import DialogForm from "./BasicComponents/DialogForm";
import Search from "./BasicComponents/Search";
import Filter from "./BasicComponents/Filter";

function UserManagement(){
  //userData is an array of users
  //Each user is an array with: [Name, Email, Company Name, Role, Status]
  //Role can be maker(0), checker(1), admin (2), superadmin (3)
  //Status can be inactive(0) or active(1)
  const [userData]= useState([  
    ["Bruce Wayne", "bw@email.com", 2,1],
    ["Mark Scout", "email@email.com", 1,1],
    ["Nix Card", "email123@email,com", 2, 0 ],
    ["Wile E. Cayote", "example@email.com", 1, 0],
    ["Lucius Fox", "email@email.com", 2, 1],
    ["Oliver Queen", "oq@email.com", 2, 1],
    ["Helena Eagan", "he@email.com", 2, 0]
  ]);
  const [roleFilter, setRoleFilter] = useState(-1);
  const [searchString, setSearchString] = useState("");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState(-1);
  const [newPassword, setNewPassword] = useState("");
  const [newPermission, setNewPermission] = useState(-1);

  const createUser = () => {

  }

  return(
    <div>
			<p className="text-3xl font-bold m-7">User Management</p>
      <div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search Users"/>
        </div>

        <div className="flex-auto">
          <Filter setter={setRoleFilter} listsAreSame={false} 
            valueList={EnumIteratorKeys(UserRoles)} labelList={EnumIteratorValues(UserRoles)} 
            setPlaceholder={true} placeholderValue={[-1,"Role"]}
          />
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
                  category: "grid",
                  row: 2,
                  fields:
                  [
                    {
                      label: "Name",
                      type: "text",
                      setter: setNewName
                    },
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
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map(user=>{
              const regEx = new RegExp(searchString, "i");
              if ((roleFilter==-1 || roleFilter==user[3]) && (searchString=="" || (user[0]+"").search(regEx)!==-1))
              return (
                <TableRow>
                  <TableCell>{user[0]}</TableCell>
                  <TableCell>{user[1]}</TableCell>
                  <TableCell>{UserRoles[Number(user[2])]}</TableCell>
                  <TableCell>
                    <select className={`${UserStatusStyling[Number(user[3])]} text-center rounded-lg`}>
                      <option className="bg-white">{UserStatusValues[Number(user[3])]}</option>
                      {Number(user[3])===1?
                        <option className="bg-white text-red-600">{UserStatusValues[0]}</option>
                      :<option className="bg-white text-green-600">{UserStatusValues[1]}</option>
                    }
                    </select>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger>Edit User</DialogTrigger>
                        <DialogForm 
                          title="Edit User" formSubmit={createUser} submitButton="Edit User"
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
                          ]}
                        />
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