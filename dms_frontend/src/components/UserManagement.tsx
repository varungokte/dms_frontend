import { useEffect, useState } from "react";
import { Table, } from "@/components/ui/table";
import useGlobalContext from "./../../GlobalContext";

import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import { EnumIteratorValues, ZoneList } from "./BasicComponents/Constants";
import FormDialog from "./FormComponents/FormDialog";
import Search from "./BasicComponents/Search";

import { CreateButtonStyling } from "./BasicComponents/PurpleButtonStyling";
import edit_icon from "./static/edit_icon.svg";
//import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";

function UserManagement(){
  const [userData, setUserData]= useState<any>();
  
  const [fieldValues, setFieldValues] = useState<any>({});

  const [fieldList] = useState<any>([
    { category: "grid", row: 2, fields: [
      { id: "N", name: "Name", type: "text", required:true },
      { id: "E", name: "Email", type: "email", immutable: true, required:true },
      { id: "P", name: "Password", type: "password", required:true },
      { id: "Z", name: "Zone", type: "select", options: EnumIteratorValues(ZoneList), required:true },
    ]},
    { category:"single", id: "RM", name: "Reporting Manager", type:"combobox", required:true },
    { category:"single", id: "M", name: "User is a Manager", type:"checkbox", required:false },
    { category:"single", id: "perm", name:"", type:"role", required:true },
  ]);

  const [roleFilter] = useState(-1);
  const [searchString, setSearchString] = useState("");
  const [selectedUser] = useState(-1);
  const [message, setMessage] = useState(<></>);
  const [added, setAdded] = useState(false);

  const newUser = useGlobalContext().createUser;
  const changeUserInfo = useGlobalContext().editUser;
  const getUsers = useGlobalContext().getAllUsers;

  const {useTitle} = useGlobalContext();

  useTitle("User Management");

  useEffect(()=>{
    getUsers().then((res)=>{
      console.log(res)
      if (res.status==200)
        setUserData(res.obj);
      else
        setUserData([]);
    }).catch(()=> {
      setUserData([])
    })
  },[added])

  const createUser = async (userValues:any) => {
    console.log("creating user", userValues);

    const data:any={};
    for (let i=0; i<fieldList.length; i++){
      const field = fieldList[i];
      if (field.category=="single")
        data[field.id] = userValues[field.id];
      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          data[gridField.id] = userValues[gridField.id]
        }
      }
    }
    if (userValues["RM"]){
      if (userValues["RM"]["values"]["E"]=="root")
        userValues["RM"]["root"]="root";
      else {
        const obj = userValues["RM"]["values"];
        userValues["RM"]={...obj}
      }
    }
    
    console.log ("SUBMITTING DATA", userValues)
    
    if (userValues["UP"]){
      const obj = userValues["UP"];
      userValues["UP"] = JSON.stringify(obj);
    }

    const res = await newUser(userValues);

    if (res==200)
      setAdded(true);
    
    return res;
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

  /* const deleteUser = (index:number) =>{
    console.log("deleting",index)
  } */

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
          <FormDialog key={-10} index={-10} edit={false} type="user"
            triggerText="+ Add User" triggerClassName={`${CreateButtonStyling} mx-5`} formSize="medium"
            formTitle="Add User" formSubmit={createUser} submitButton="Add User"
            form={fieldList} setter={setFieldValues} fieldValues={fieldValues} currentFields={{}} suggestions="RM"
          />
        </div>
      </div>
      <div className="m-7">
        {message}
        {userData
          ?userData.length==0
            ?<EmptyPageMessage sectionName="users" emotion={true} />
            :<Table className="bg-white border-2 rounded-xl">
              <HeaderRows headingRows={["Name", "Email Address","Reporting Manager", "Zone", "Role", "Status", "Action"]} />
              <BodyRowsMapping
                list={userData} columns={["N","E", "RM", "Z", "R","S"]} dataType={["text", "text", "objName", "zone","text", "userStatus", "action"]}
                searchRows={searchString==""?[]:[searchString,"N","E"]} filterRows={roleFilter==-1?[]:[roleFilter,"S"]}
                action = {userData.map((_:any, index:number)=>{
                  return(
                    <div className="flex flex-row">
                      <FormDialog key={index} index={index} type="user" edit={true}
                        triggerClassName={""} triggerText={<img src={edit_icon} className="mr-5"/>}
                        formTitle="Edit User" formSubmit={editUser} submitButton="Edit User" formSize="medium"
                        form={fieldList} setter={setFieldValues} fieldValues={fieldValues} currentFields={userData[index]}
                      />
                      {/* <DeleteConfirmation thing="user" deleteFunction={deleteUser} currIndex={index} /> */}
                    </div>
                  )
                })}
              />
            </Table>
          :<LoadingMessage sectionName="users" />
        }
      </div>
    </div>
  )
}
export default UserManagement;