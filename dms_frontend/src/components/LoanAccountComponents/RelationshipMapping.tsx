import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import FormDialog from "../BasicComponents/FormDialog";
import Filter from "../BasicComponents/Filter";

import { EnumIteratorKeys, EnumIteratorValues, UserRoles } from "../BasicComponents/Constants";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { Edit2Icon } from "lucide-react";
import ProfileIcon from "../BasicComponents/ProfileIcon";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";
import useGlobalContext from "./../../../GlobalContext";

function RelationshipMapping(props:any){
  const [userInfo, setUserInfo] = useState([]);
  const [role, setRole] = useState("");

  const [fieldValues, setFieldValues] = useState([{}]);

  const [fieldList] = useState([
    {category:"grid", row: 2, fields:[
      {id:"C", name:"Name/Email", type:"combobox"},
      { id: "R", name: "Role", type: "role" },
    ]},
  ]);

  const { getUserSuggestions, getTeamList } = useGlobalContext();

  useEffect(()=>{
    getTeamList(props.loanId).then(res=>{
      const arr:any = [];
      if (res){
        for (let i=0; i<res.M.length; i++)
          arr.push([res.M[i].N, res.M[i].E, "NOROLE"])
        
        setUserInfo(arr);
      }
    });
  },[]);

  useEffect(()=>{
    console.log("THE FIELD VALUES", fieldValues)
  },[fieldValues])

  const addUser = (e:any) =>{
    e.preventDefault();

    const arr:any=[];

    for (let i=0; i<Object.keys(fieldValues).length; i++){
      console.log(Object.keys(fieldValues)[0])
      //@ts-ignore
      arr.push({"N":fieldValues[i]["0"].N, "E": fieldValues[i]["0"].E, "R":(fieldValues[i].R)?Number(fieldValues[i].R):1})
    }

    
    console.log("SENDING THE DATA",arr);

    const data={
      "M":arr,
      "_loanId": props.loanId
    };

    console.log("DATA", data)

    /* addTeamMember(data).then(res=>{
      console.log(res)
    }) */

  }

  return (
    <div className="mt-8">
      <div className="flex flex-row">
        <div className='flex-auto'>
          <Filter setter={setRole} listsAreSame={false} labelList={EnumIteratorValues(UserRoles)} valueList={EnumIteratorKeys(UserRoles)}
            setPlaceholder={true} placeholderValue={[-1, "All Roles"]}
          />
        </div>
        <div className=" m-auto">
          <FormDialog 
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} px-5 py-3`} formSize="medium"
            formTitle="Relationship Mapping" formSubmit={addUser} submitButton="Save"
            form = {fieldList} setter={setFieldValues} fieldValues={fieldValues}
            repeatFields={true} 
            suggestions={true} suggestionsFunction={getUserSuggestions}
          />  
        </div>
      </div>

      <div className="flex flex-row flex-wrap">
        {userInfo.map((user,index)=>{
          return (
            <Card key={index} className="mr-5 my-5 w-72 rounded-xl">
              <CardHeader>
                <CardTitle>	
                  <div className="flex flex-row">
                    <div className="flex-auto">
                      <ProfileIcon name={user[0]} size="small" />
                    </div>
                    
                    <div className="">
                      <Edit2Icon size="20px"/>
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
      <FormSectionNavigation isForm={false} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )
}

export default RelationshipMapping;