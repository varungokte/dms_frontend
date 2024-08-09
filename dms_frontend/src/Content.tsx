import { createElement } from 'react';
import { Routes, Route } from 'react-router-dom';

import PageNotFound from './components/BasicMessages/PageNotFound';
import CreateLoanAccount from './components/CreateLoanAccount';
import { ComponentList, FieldValues } from 'DataTypes';
import UserProfile from './UserProfile';

function Content(props:{componentList:ComponentList|undefined, masterLists:FieldValues|undefined, mastersIdList:string[]|undefined,setChangeInMasters:Function}){
  return (
    <Routes>
      {props.componentList
        ?props.componentList.map((item,index)=>{
          const componentProps:any = { key:index, label: item.name}
          if (item.name=="Masters"){
            componentProps["masterLists"] = props.masterLists;
            componentProps["idList"] = props.mastersIdList;
            componentProps["callMasterLists"] = props.setChangeInMasters
          }
          return <Route key={index} path={item.path} element={createElement(item.component, componentProps)} />
        })
        :<></>
      }
      <Route key={"C"} path="/loan/create/*" element={<CreateLoanAccount/>} />
      <Route key={"P"} path="/user" element={<UserProfile/>} />
      <Route key={"N"} path="/*" element={<PageNotFound/>} />
    </Routes>
  )
}

export default Content;