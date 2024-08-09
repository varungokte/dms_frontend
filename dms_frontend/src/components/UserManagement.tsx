import {  useContext, useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";

import { DataTable } from "./BasicComponents/Table";
import { ZoneList, sectionNames } from "../../Constants";
import FormDialog from "./FormComponents/FormDialog";

import edit_icon from "./static/edit_icon.svg";
//import DeleteConfirmation from "./BasicComponents/DeleteConfirmation";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import { FieldAttributesList, FieldValues, TableDataTypes, ToastOptionsAttributes } from "DataTypes";
import Toast from "./BasicComponents/Toast";
import { PermissionContext } from "@/MenuRouter";
import { Pagination } from "./BasicComponents/Pagination";
import SearchByType from "./BasicComponents/SearchByType";
import ForbiddenMessage from "./BasicMessages/FobiddenMessage";
import AddButton from "./Buttons/AddButton";

function UserManagements(props:{label:string}){
  //useEffect(()=>console.log("user props",props),[props])
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [userData, setUserData]= useState<FieldValues[]>();
   
  const fieldList:FieldAttributesList = [
    { category: "grid", row: 2, fields: [
      { id: "N", name: "Name", type: "text", required:true },
      { id: "E", name: "Email", type: "email", immutable: true, required:true },
      { id: "P", name: "Password", type: "password", required:true },
      { id: "Z", name: "Zone", type: "select", options: ZoneList, immutable: true, required:true },
    ]},
    { category:"single", id: "RM", name: "Reporting Manager", type:"combobox", immutable: true, required:true },
    { category:"single", id: "M", name: "User is a Manager", type:"checkbox", required:false },
    { category:"single", id: "R", name:"Role", type:"role", required:true },
  ];

  const {userPermissions} = useContext(PermissionContext);

  const [addOpen, setAddOpen] = useState([false]);
  const [editOpen, setEditOpen] = useState<boolean[]>([]);

  const [forbidden, setForbidden] = useState(<></>);

  const editPermission = userPermissions[sectionNames[props.label]].includes("edit");
  const tableHeadings = ["Name", "Email Address","Reporting Manager", "Zone", "Role", "Status"];
  const tableDataTypes:TableDataTypes[] = ["text", "text", "text", "text","text", "user-status"];

  //const [roleFilter] = useState(-1);
  const [searchString, setSearchString] = useState("");
  const [searchType, setSearchType] = useState("");
  const searchOptions = [{label:"User Name", value:"N"}, {label:"User Email", value:"E"}];

  const [added, setAdded] = useState(true);
  const [selectedUser,setSelectedUser] = useState(-1);
  const [userStatus, setUserStatus] = useState(-1);
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //useEffect(()=>console.log("search string",searchString),[searchString])

  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage,searchString,searchType]);

  const getUsers = async () => {
    if (!added)
      return;
    
    const {getUsers} = useGlobalContext();
    const res = await getUsers({currentPage, rowsPerPage, searchString, searchType });
    //console.log("res",res)
    if (res.status==200){
      if (res.obj && res.obj[0] && res.obj[0]["data"]){
        setEditOpen(new Array(res.obj[0]["data"].length).fill(false));
        setUserData(res.obj[0]["data"]);
      }
      if (res.obj && res.obj[0] && res.obj[0]["metadata"] && res.obj[0]["metadata"][0] && res.obj[0]["metadata"][0])
        setTotalPages(Math.ceil(Number(res.obj[0]["metadata"][0]["total"])/Number(rowsPerPage)));
    }
    else
      setUserData([]);
    setAdded(false);
  }

  useEffect(()=>{
    getUsers();
  },[added,searchString]);

  const createUser = async (userValues:any) => {
    const {addUser} = useGlobalContext();

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
    //console.log("valid data",data)
    if (userValues["RM"]){
      const email = userValues["RM"]["values"]["E"];
      userValues["RM"]=email;
    }
    
    //console.log ("SUBMITTING DATA", userValues)
    
    if (userValues["UP"]){
      const obj = userValues["UP"];
      userValues["UP"] = JSON.stringify(obj);
    }

    const res = await addUser(userValues);

    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"add", section:"User"});
    }
    else if (res==403)
      setForbidden(<ForbiddenMessage/>);
    else
      setToastOptions({open:true, type:"error", action:"add", section:"User"});    
    return res;
  }

  const editUser = async (userValues:any, index:number) => {
    const {editUser} = useGlobalContext();

    if (selectedUser==-1 && index==undefined || !userData)
      return;
  
    if (selectedUser!=-1){
      const id = userData[selectedUser]["_id"];
      userValues["_id"] = id;
    }

    for (let i=0; i<Object.keys(userData[index]).length; i++){
      const key = Object.keys(userData[index])[i];
      if (userData[index][key]==userValues[key])
        delete userValues[key];
    }

    userValues["_id"] = userData[index]["_id"]

    if (userValues["RM"] && typeof userValues["RM"]!="string"){
      const email = userValues["RM"]["values"]["E"];
      userValues["RM"]=email;
    }
    
    if (userValues["UP"]){
      const obj = userValues["UP"];
      userValues["UP"] = JSON.stringify(obj);
    }

    //console.log("SUBMITTING", userValues);

    const res = await editUser(userValues);

    //console.log("Response",res);

    if (res==200){
      setAdded(true);
      setToastOptions({open:true, type:"success", action:"edit", section:"User"});
    }
    else
      setToastOptions({open:true, type:"error", action:"edit", section:"User"});

    return res;
  }

  useEffect(()=>{
    editUser({"S":userStatus}, selectedUser);
  },[userStatus]);

  /* const deleteUser = (index:number) =>{
    console.log("deleting",index)
  } */

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>

      <div className="flex flex-row">
        <div className='m-auto flex-auto'>
          <SearchByType className="mx-7" searchString={searchString} setSearchString={setSearchString} searchType={searchType} setSearchType={setSearchType} typeOptions={searchOptions} />
        </div>

        <div className="flex-auto">
        </div>
        {userPermissions[sectionNames[props.label]].includes("add")
          ?<div>
            <AddButton sectionName="user"  onClick={()=>setAddOpen([true])} />
            {addOpen[0]
              ?<FormDialog key={-10} index={0} edit={false} type="user"
                formOpen={addOpen[0]} setFormOpen={setAddOpen} formSize="md"
                formTitle="Add User" formSubmit={createUser} submitButton="Add User"
                form={fieldList} currentFields={{}} suggestions="RM" getRoles={true}
              />
              :<></>
            }
          </div>
          :<></>
        }
      </div>

      <div className="m-7">
        {userData
          ?userData.length==0
            ?<EmptyPageMessage sectionName="users" emotion />
            :<DataTable className="bg-white rounded-xl" 
              headingRows={editPermission?tableHeadings.concat("Action"):tableHeadings}
              tableData={userData} columnIDs={["N","E", "RM", "Z", "R","S"]} dataTypes={editPermission?tableDataTypes.concat("action"):tableDataTypes}
              cellClassName={["","","","","", userPermissions[sectionNames[props.label]].includes("edit")?"editable":"",""]}
              setEntityStatus={setUserStatus} setSelectedEntity={setSelectedUser}
              action = {userData.map((_:any, index:number)=>{
                return(
                  <div className="flex flex-row">
                    {userPermissions[sectionNames[props.label]].includes("edit")
                      ?<div>
                        <button onClick={()=>setEditOpen(curr=>{curr[index]=true;return [...curr]})}><img src={edit_icon} className="mr-5"/></button>
                        {editOpen[index]
                          ?<FormDialog key={index} index={index} type="user" edit
                            formOpen={editOpen[index]} setFormOpen={setEditOpen}
                            formTitle="Edit User" formSubmit={editUser} submitButton="Edit User" formSize="md"
                            form={fieldList} currentFields={userData[index]} suggestions="RM" getRoles
                          />
                          :<></>
                        }
                      </div>
                      :""
                    }
                    {/* <DeleteConfirmation thing="user" deleteFunction={deleteUser} currIndex={index} /> */} 
                  </div>
                )
              })}
            />
            
          :<LoadingMessage sectionName="users" />
        }
      </div>
      {userData && userData.length>0
        ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }
      {forbidden}
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
    </div>
  )
}

const UserManagement =UserManagements // memo(UserManagements,(props,props2)=>{console.log("CHECKING"); console.log("old",props,"new",props2,"compare",props.label==props2.label);return props.label==props2.label;});

export default UserManagement;