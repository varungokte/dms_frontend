import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";

import FormDialog from "../BasicComponents/FormDialog";
import Filter from "../BasicComponents/Filter";

import PurpleButtonStyling from "../BasicComponents/PurpleButtonStyling";
import ProfileIcon from "../BasicComponents/ProfileIcon";
import { EnumIteratorKeys, EnumIteratorValues, UserRoles } from "../BasicComponents/Constants";

function RelationshipMapping(){
  const [userInfo, setUserInfo] = useState([
    ["Kal-El", "Maker"],
    ["Salvor Hardin", "Checker"],
    ["Lucy McLean","Checker"],
    ["Cassian Andor","Checker"],
    ["Peter Parker","Maker"],
    ["Benjamin Sisko","Checker"],
  ])

  const [role, setRole] = useState("");

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState(-1);
  const [newOperation, setNewOperation] = useState("");

  const addUser = (e:any) =>{
    e.preventDefault();
  }

  const editUser = (e:any) => {
    e.preventDefault();
    
  }

  return (
    <div className="mt-8">
      <div className="flex flex-row">
        <div className='flex-auto'>
          <Filter setter={setRole} listsAreSame={false} labelList={EnumIteratorValues(UserRoles)} valueList={EnumIteratorKeys(UserRoles)}
            setPlaceholder={true} placeholderValue={[-1, "All Roles"]}
          />
        </div>
        
        <div>
          <FormDialog 
            triggerText="+ Add"
            triggerClassName={`${PurpleButtonStyling} w-10`}
            formTitle="Relationship Mapping"
            formSubmit={addUser}
            submitButton="Save"
            form = {[
              {category:"single", label:"Name", type:"text", setter:setNewName },
              {category:"grid", row: 2, fields:[
                {label: "Role", type: "select", setter: setNewRole, options: EnumIteratorValues(UserRoles) },
                {label: "Operation", type: "text", setter: setNewOperation }
              ]}
            ]}
          />  
        </div>
      </div>

      <div className="flex flex-row flex-wrap">
        {userInfo.map(user=>{
          return (
            <Card className="mr-5 my-5 w-72 rounded-xl">
              <CardHeader>
                <CardTitle>	
                  <div className="flex flex-row">
                    <div className="flex-auto">
                      <ProfileIcon name={user[0]} size="small" />
                    </div>
                    
                    <div className="">
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <p className="font-medium">{user[0]}</p>
                <p className="font-light">{user[1]}</p>
                <p className="font-light">{role}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default RelationshipMapping;