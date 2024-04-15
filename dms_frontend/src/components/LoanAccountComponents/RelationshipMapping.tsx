import { useState } from "react";
import Filter from "../BasicComponents/Filter";
import { EnumIteratorKeys, EnumIteratorValues, UserRoles } from "../BasicComponents/Constants";
import PurpleButtonStyling from "../BasicComponents/PurpleButtonStyling";
import FormDialog from "../BasicComponents/FormDialog";

function RelationshipMapping(){
  const [role, setRole] = useState("");

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState(-1);
  const [newOperation, setNewOperation] = useState("");

  const addUser = (e:any) =>{
    e.preventDefault();
  }

  return (
    <div className="bg-white rounded-xl">
      <br/>
      <p className="text-2xl font-bold mx-7 mb-2">Relationship Mapping</p>
      <hr/>
      <div className="flex flex-row m-7">
        <div className='flex-auto'>
          <Filter setter={setRole} listsAreSame={false} labelList={EnumIteratorValues(UserRoles)} valueList={EnumIteratorKeys(UserRoles)}
            setPlaceholder={true} placeholderValue={[-1, "All Roles"]}
          />
        </div>
        
        <div>
          <FormDialog 
            triggerText="+ Add"
            triggerClassName={PurpleButtonStyling}
            formTitle="Relationship Mapping"
            formSubmit={addUser}
            submitButton="Save"
            form = {[
              {category:"single", label:"Name", type:"text", setter:setNewName },
              {category:"grid", row: 2, fields:[
                {label:"Role", type:"select", setter:setNewRole, options:EnumIteratorValues(UserRoles) },
                {label: "Operation", type:"text", setter:setNewOperation }
              ]}
            ]}
          />  
        </div>
      </div>

      <div className=""></div>
    </div>
  )
}

export default RelationshipMapping;