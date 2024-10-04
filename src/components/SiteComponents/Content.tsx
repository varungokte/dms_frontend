import { createElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PageNotFound from "@/components/BasicMessages/PageNotFound";
import CreateLoanAccount from "@/components/CreateLoanAccount";
import { FieldValues, SetStateBoolean } from "@/types/DataTypes";
import { ComponentList } from "@/types/ComponentProps";
import UserProfile from "./UserProfile";

function Content(props:{componentList:ComponentList|undefined, masterLists:FieldValues|undefined, mastersId:string|undefined,setChangeInMasters:SetStateBoolean}){
  return (
    <Routes>
      {props.componentList
        ?props.componentList.map((item,index)=>{
          const componentProps:any = { key:index, label: item.name}
          if (item.panopticPage)
            componentProps["panopticPage"] = item.panopticPage;
          if (item.name=="Masters"){
            componentProps["masterLists"] = props.masterLists;
            componentProps["id"] = props.mastersId;
            componentProps["callMasterLists"] = props.setChangeInMasters;
          }
          return <Route key={index} path={item.path} element={createElement(item.component, componentProps)} />
        })
        :<></>
      }
      <Route key={"V"} path="/verify" element={<Navigate to="/"/>}  />
      <Route key={"C"} path="/loan/create/*" element={<CreateLoanAccount/>} />
      <Route key={"P"} path="/user" element={<UserProfile/>} />
      <Route key={"N"} path="/*" element={<PageNotFound/>} />
    </Routes>
  )
}

export default Content;