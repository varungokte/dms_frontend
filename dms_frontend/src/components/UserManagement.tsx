import { useEffect, useState } from "react";
import { Table, } from "@/components/ui/table";
import useGlobalContext from "./../../GlobalContext";

import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import { UserRoles, EnumIteratorValues } from "./BasicComponents/Constants";
import FormDialog from "./BasicComponents/FormDialog";
import Search from "./BasicComponents/Search";
import Filter from "./BasicComponents/Filter";
import ActionDialog from "./BasicComponents/ActionDialog";

import PurpleButtonStyling from "./BasicComponents/PurpleButtonStyling";
import edit_icon from "./static/edit_icon.svg";
import delete_icon from "./static/delete_icon.svg";

//Routes: addUser,editUser, getUser
function UserManagement(){
  const [userData, setUserData]= useState<any>([]);
  const [roleFilter, setRoleFilter] = useState(-1);
  const [searchString, setSearchString] = useState("");
  const [selectedUser, setSelectedUser] = useState(-1);
  const [message, setMessage] = useState(<></>);

  const [fieldValues, setFieldValues] = useState({
    "N": "Conan O'Brien", "E": "email",
    "P": "123", "R": "1",
  })

  const [fieldList, setFieldList] = useState([
    { category: "grid", row: 2, fields: [
      { id: "N", name: "Name", type: "text", editable: true },
      { id: "E", name: "Email", type: "email", editable: false },
      { id: "R", name: "Password", type: "password", editable: true },
      { id: "P", name: "Role", type: "select", options: EnumIteratorValues(UserRoles), editable: true },
    ]}
  ]);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  
  const [userAdded, setUserAdded] = useState(false);

  const newUser = useGlobalContext().createUser;
  const changeUserInfo = useGlobalContext().editUser;
  const getUsers = useGlobalContext().getAllUsers;

  useEffect(()=>{
    getUsers().then((res)=>{
      const arr:any =[];
      if (res.length==0)
        setUserData(["Person 1", "Email1", 0]);
      else{
        res.map((user:any)=>{
          arr.push([user.N, user.E, user.S])
        });
        setUserData(arr);
      }
    }).catch(err=> console.log(err))
  },[userAdded])

  const createUser = (e:any) => {
    e.preventDefault();
    const data:any={};
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single"){
        //@ts-ignore
        data[field.id] = fieldValues[field.id];
      }
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          //@ts-ignore
          data[gridField.id] = fieldValues[gridField.id]
        }
      }
    }
    
    console.log("TEST ZE DATA", data);

    /* newUser(data).then(res=>{
      console.log(res);
      setUserAdded(true);
    }).catch((err)=>{
      if (err=="dupliate_user"){
        setMessage(<p>Duplicate User</p>)
      }
    }) */
  }

  const editUser = () => {
    if (selectedUser==-1) 
      return;
    
    const arr = userData[selectedUser];
    console.log("THE SELECTED USER", selectedUser)
    const data = {} as any;

    if (newName!=arr[0])
      data["N"] = newName
    if (newEmail!=arr[1])
      data["E"] = newEmail
    if (newPassword!=arr[2])
      data["P"] = newPassword
    if (newRole!=arr[3])
      data["R"] = newRole

    changeUserInfo(data).then(res=>{
      console.log(res);
    }).catch((err)=>{
      if (err=="dupliate_user"){
        setMessage(<p>Duplicate User</p>)
      }
    })
  }

  const deleteUser = (index:number) =>{

  }

  return(
    <div>
			<p className="text-3xl font-bold m-7">User Management</p>
      <div className="flex flex-row">
        <div className='m-auto flex-auto'>
          <Search setter={setSearchString} label="Search Users"/>
        </div>

        <div className="flex-auto">
          {/* <Filter setter={setRoleFilter} listsAreSame={false} valueList={EnumIteratorKeys(UserRoles)} labelList={EnumIteratorValues(UserRoles)} 
            setPlaceholder={true} placeholderValue={[-1,"Role"]}
          /> */}
        </div>

        <div className="">
          <FormDialog
            triggerText="+ Add User" triggerClassName={PurpleButtonStyling} formSize="medium"
            formTitle="Add User" formSubmit={createUser} submitButton="Add User"
            form={fieldList} setter={setFieldValues}
          />
        </div>
      </div>
      <div className="m-7">
      {message}
        <Table className="bg-white border-2 rounded-xl">
          <HeaderRows headingRows={[["Name"], ["Email Address"]/* , ["Role"] */, ["Status"], ["Action"]]} />
          {userData.length==-1?<p className="text-center">No users available</p>:<BodyRowsMapping
            list={userData} dataType={["text", "text"/* , "role" */, "userStatus", "action"]}
            searchRows={searchString==""?[]:[searchString,0,1]} filterRows={roleFilter==-1?[]:[roleFilter,2]}
            action = {userData.map((item:any, index:number)=>{
              return(
                <div className="flex flex-row">
                  <FormDialog 
                    triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>}
                    formTitle="Edit User" formSubmit={editUser}  submitButton="Edit User" formSize="medium"
                    form={fieldList} setter={setFieldValues} 
                    edit={true} userValues={{"N": userData[index][0], "E": userData[index][1], "S": userData[index][2]}}
                  />
                  <ActionDialog trigger={<img src={delete_icon}/>} title="Delete User?" description="Are you sure you want to delete this user?" 
                    actionClassName="text-white bg-red-600 rounded-lg" actionLabel="Delete" actionFunction={deleteUser(index)} 
                  />
                </div>
              )
            })}
          />}
          
        </Table>
      </div>
    </div>
  )
}
export default UserManagement;