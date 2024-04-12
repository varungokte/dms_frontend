import { useState } from "react";
import { Table, } from "@/components/ui/table";
import useGlobalContext from "./../../GlobalContext";

import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import { UserRoles, EnumIteratorValues, EnumIteratorKeys } from "./BasicComponents/Constants";
import FormDialog from "./BasicComponents/FormDialog";
import Search from "./BasicComponents/Search";
import Filter from "./BasicComponents/Filter";
import ActionDialog from "./BasicComponents/ActionDialog";

import PurpleButtonStyling from "./BasicComponents/PurpleButtonStyling";
import edit_icon from "./static/edit_icon.svg";
import delete_icon from "./static/delete_icon.svg";

//Routes: addUser,editUser, getUser
function UserManagement(){
  const newUser = useGlobalContext().createUser;
  //userData is an array of users
  //Each user is an array with: [Name, Email, Company Name, Role, Status]
  //Role can be maker(0), checker(1), admin (2), superadmin (3)
  //Status can be inactive(0) or active(1)
  const [userData]= useState([  
    ["Bruce Wayne", "bw@email.com", 2,1],
    ["Mark Scout", "email@email.com", 1,1],
    ["Nix Card", "email123@email.com", 2, 0 ],
    ["Wile E. Cayote", "example@email.com", 1, 0],
    ["Lucius Fox", "email@email.com", 2, 1],
    ["Oliver Queen", "oq@email.com", 2, 1],
    ["Helena Eagan", "he@email.com", 2, 0]
  ]);
  const [roleFilter, setRoleFilter] = useState(-1);
  const [searchString, setSearchString] = useState("");
  const [selectedUser, setSelectedUser] = useState(-1);
  const [message, setMessage] = useState(<></>);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState(0);
  const [newPassword, setNewPassword] = useState("");

  const createUser = (e:any) => {
    e.preventDefault();
    const data = {
      N: newName,
      E: newEmail,
      P: newPassword,
      R: newRole,
    }

    newUser(data).then(res=>{
      console.log(res);
    }).catch((err)=>{
      if (err=="dupliate_user"){
        setMessage(<p>Duplicate User</p>)
      }
    })
  }

  const editUser = () => {
    if (selectedUser==-1) 
      return;
    
    const arr = userData[selectedUser];
    const data = {} as any;

    if (newName!=arr[0])
      data["N"] = newName
    if (newEmail!=arr[1])
      data["E"] = newEmail
    if (newPassword!=arr[2])
      data["P"] = newPassword
    if (newRole!=arr[3])
      data["R"] = newRole
  }

  const deleteUser = (index:number) =>{

  }

  return(
    <div>
			<p className="text-3xl font-bold m-7">User Management</p>
      <div className="flex flex-row">
        <div className=''>
          <Search setter={setSearchString} label="Search Users"/>
        </div>

        <div className="flex-auto">
          <Filter setter={setRoleFilter} listsAreSame={false} valueList={EnumIteratorKeys(UserRoles)} labelList={EnumIteratorValues(UserRoles)} 
            setPlaceholder={true} placeholderValue={[-1,"Role"]}
          />
        </div>

        <div className="">
          <FormDialog
            triggerClassName={PurpleButtonStyling} 
            triggerText="+ Add User" 
            formTitle="Add User" 
            formSubmit={createUser}
            submitButton="Add User"
            //category can be: single (entire line is one input field) or grid
            //if grid, it will fields, whose value is an array of object; each object is a field
            form={[
            { category: "grid", row: 2, fields: [
              { label: "Name", type: "text", setter: setNewName },
              { label: "Email", type: "email", setter: setNewEmail },
              { label: "Password", type: "password", setter: setNewPassword },
              { label: "Role", type: "select", setter: setNewRole, options: ["Maker", "Checker", "Admin"] },
            ]}]}
          />
        </div>
      </div>
      <div className="m-7">
      {message}
        <Table className="bg-white border-2 rounded-xl">
          <HeaderRows headingRows={[["Name"], ["Email Address"], ["Role"], ["Status"], ["Action"]]} />
          <BodyRowsMapping
            list={userData} dataType={["text", "text", "role", "userStatus", "action"]}
            searchRows={searchString==""?[]:[searchString,0]} filterRows={roleFilter==-1?[]:[roleFilter,2]}
            action = {userData.map((item:any, index:number)=>{
              return(
                <div className="flex flex-row">
                  <FormDialog 
                    triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>}
                    formTitle="Edit User" formSubmit={editUser}  submitButton="Edit User"
                    form={[
                      { category: "grid", row: 2, fields: [
                        { label: "Name", type: "text", setter: setNewName },
                        { label: "Email", type: "email", setter: setNewEmail },
                        { label: "Password", type: "password", setter: setNewPassword },
                        { label: "Role", type: "select", setter: setNewRole, options: ["Maker", "Checker", "Admin"] },
                      ]}]}
                    prefill={true}
                    prefillValues={[item[0],item[1],"",item[2]]}
                    prefillVariables={[newName,newEmail,newPassword,newRole]}
                    currentIndex={index}
                    currentSetter={setSelectedUser}
                  />
                    <ActionDialog trigger={<img src={delete_icon}/>} title="Delete User?" description="Are you sure you want to delete this user?" 
                      actionClassName="text-white bg-red-600 rounded-lg" actionLabel="Delete" actionFunction={deleteUser(index)} 
                    />
                    
                </div>
              )
            })}
          />
        </Table>
      </div>
    </div>
  )
}
export default UserManagement;