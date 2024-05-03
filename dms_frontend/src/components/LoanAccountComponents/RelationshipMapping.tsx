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
  const [userInfo, setUserInfo] = useState([
    ["Kal-El", "Maker"],
    ["Salvor Hardin", "Checker"],
    ["Lucy McLean","Checker"],
    ["Cassian Andor","Checker"],
    ["Peter Parker","Maker"],
    ["Benjamin Sisko","Checker"],
  ]);
  const [role, setRole] = useState("");

  const [fieldValues, setFieldValues] = useState([{}]);

  const [userSuggestions, setUserSuggestions] = useState([]);

  const [fieldList, setFieldList] = useState([
    {category:"grid", row: 2, fields:[
      {id:"N", name:"Name/Email", type:"text"},
      {id:"E", name:"Email", type:"text"},
      { id: "R", name: "Role", type: "select", options: EnumIteratorValues(UserRoles) },
    ]}
  ]);

  const { getUserSuggestions, getTeamList, addTeamMember } = useGlobalContext();

  useEffect(()=>{
    getTeamList(props.loanId).then(res=>{
      console.log("GETTEAM",res);
      if (res && res.length>0)
        setUserInfo(res);
    });

    getUserSuggestions().then(res=>{
      console.log("AUTONS", res)
      if (res)
        setUserSuggestions(res["U"]);
    })
  },[]);

  const addUser = (e:any) =>{
    e.preventDefault();

    const arr=[];

    /* for (let i=0; i<fieldValues.length; i++){
      //@ts-ignore
      data.push({"N":fieldValues[i].N.N, "E": fieldValues[i].N.E, "R":(fieldValues[i].R)?Number(fieldValues[i].R):1})
    } */

    arr.push({"E": "varungokte.codium@gmail.com", "N": "Test Company"})

    console.log("SENDING THE DATA",arr);

    const data={
      "M":arr,
      "_loanId": props.loanId
    }

    addTeamMember(data).then(res=>{
      console.log(res)
    })

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
        <div className=" m-auto">
          <FormDialog 
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} px-5 py-3`} formSize="medium"
            formTitle="Relationship Mapping" formSubmit={addUser} submitButton="Save"
            form = {fieldList} setter={setFieldValues} fieldValues={fieldValues}
            repeatFields={true} suggestions={userSuggestions}
            //apiCallOnClick={true} apiFunction={getUserSuggestions}
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