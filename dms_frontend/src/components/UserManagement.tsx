import { useEffect, useState } from "react";
import { Table, } from "@/components/ui/table";
import useGlobalContext from "./../../GlobalContext";

import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import { EnumIteratorValues, ZoneList } from "./BasicComponents/Constants";
import FormDialog from "./BasicComponents/FormDialog";
import Search from "./BasicComponents/Search";
import ActionDialog from "./BasicComponents/DeleteConfirmation";

import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import edit_icon from "./static/edit_icon.svg";
import delete_icon from "./static/delete_icon.svg";

function UserManagement(){
  const [userData, setUserData]= useState<any>([{N:"Conan O'Brien", E:"1@2", RM:"Person1", Z:1, S:1},{N:"Donna Noble", E:"1@3", RM:"Person2", Z:2, S:1}]);
  
  const [fieldValues, setFieldValues] = useState<any>({
    "N": "Conan O'Brien", "E": "email",
    "P": "123", "R": "1",
  })

  const [fieldList] = useState<any>([
    { category: "grid", row: 2, fields: [
      { id: "N", name: "Name", type: "text", },
      { id: "E", name: "Email", type: "email", immutable: true },
      { id: "P", name: "Password", type: "password" },
      { id: "Z", name: "Zone", type: "select", options: EnumIteratorValues(ZoneList) },
    ]},
    { category:"single", id: "RM", name: "Reporting Manager", type:"combobox" },
    { category:"single", id:"RP", name:"", type:"role" },
  ]);

  const [roleFilter] = useState(-1);
  const [searchString, setSearchString] = useState("");
  const [selectedUser] = useState(-1);
  const [message, setMessage] = useState(<></>);
  const [userAdded, setUserAdded] = useState(false);

  const newUser = useGlobalContext().createUser;
  const changeUserInfo = useGlobalContext().editUser;
  const getUsers = useGlobalContext().getAllUsers;

  const {useTitle, getUserSuggestions} = useGlobalContext();

  useTitle("User Management")

  useEffect(()=>{
    getUsers().then((res)=>{
      if (res.length==0)
      setUserData([])
      else
        setUserData(res);
      
    }).catch(()=> {
      setUserData([])
    })
  },[userAdded])

  const createUser = (e:any) => {
    e.preventDefault();
    const data:any={};
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single")
        data[field.id] = fieldValues[field.id];
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          data[gridField.id] = fieldValues[gridField.id]
        }
      }
    }
    
    newUser(data).then(res=>{
      console.log("new user",res);
      setUserAdded(true);
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
    console.log("THE SELECTED USER",arr, selectedUser)
    const data = {} as any;

    changeUserInfo(data).then(res=>{
      console.log(res);
    }).catch((err)=>{
      if (err=="dupliate_user"){
        setMessage(<p>Duplicate User</p>)
      }
    })
  }

  const deleteUser = (index:number) =>{
    console.log("deleting",index)
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
          <FormDialog key={-10} index={-10}
            triggerText="+ Add User" triggerClassName={CreateButtonStyling} formSize="medium"
            formTitle="Add User" formSubmit={createUser} submitButton="Add User"
            form={fieldList} setter={setFieldValues} fieldValues={fieldValues}
            suggestions={true}  suggestionsFunction={getUserSuggestions}
          />
        </div>
      </div>
      <div className="m-7">
      {message}
      {userData.length>0?
        <Table className="bg-white border-2 rounded-xl">
        <HeaderRows headingRows={[["Name"], ["Email Address"],["Reporting Manager"], ["Zone"], /* , ["Role"] */, ["Status"], ["Action"]]} />
        <BodyRowsMapping
          list={userData} columns={["N","E", "RM", "Z", "S"]} dataType={["text", "text", "text", "zone", "userStatus", "action"]}
          searchRows={searchString==""?[]:[searchString,"N","E"]} filterRows={roleFilter==-1?[]:[roleFilter,"S"]}
          action = {userData.map((item:any, index:number)=>{
            item;
            return(
              <div className="flex flex-row">
                <FormDialog key={index} index={index}
                  triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>}
                  formTitle="Edit User" formSubmit={editUser} submitButton="Edit User" formSize="medium"
                  form={fieldList} setter={setFieldValues} 
                  edit={false} currentFields={userData[index]}
                />
                <ActionDialog trigger={<img src={delete_icon}/>} title="Delete User?" description="Are you sure you want to delete this user?" 
                  actionClassName="text-white bg-red-600 rounded-lg" actionLabel="Delete" actionFunction={deleteUser} currentIndex={index} 
                />
              </div>
            )
          })}
        />
        </Table>
        :<p className="m-auto font-medium text-xl text-gray-700">No users here {`:(`}</p>
      }
      </div>
    </div>
  )
}
export default UserManagement;