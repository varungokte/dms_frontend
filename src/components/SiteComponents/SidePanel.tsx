import { createElement, useState } from "react";
import { NavLink } from "react-router-dom";
import giveAllPermissions from "@/functions/giveAllPermissions";
import { FieldValues } from "@/types/DataTypes";
import { ComponentList } from "@/types/ComponentProps";

import { editUser } from "@/apiFunctions/userAPIs";

import { Tooltip, Typography } from "@mui/material";
import beacon_logo from "@/static/beacon_logo.png";

function SidePanel(props:{componentList:ComponentList|undefined, token:FieldValues|undefined}){
	const [hover,setHover] = useState(-1);

  const fixPermissions = async () => {
    if (!props.token)
      return;
    const obj = { _id:props.token["_userId"], UP: giveAllPermissions() };
		const res = await editUser(obj);
    console.log("permissions have been set",res);
  }
  return (
    <div>
      <NavLink to={"/"} key={-1}	onMouseEnter={()=>setHover(-1)} onMouseLeave={()=>setHover(-1)}>
        <img src={beacon_logo} width={"250px"} className="m-auto p-3"/>
      </NavLink>
      <div className="mx-8 my-5">
        <Tooltip placement="right" title={<Typography >Clicking this button will give this user all permissions. This is for testing purposes.</Typography>}><button onClick={fixPermissions}>Fix Permissions</button></Tooltip>
        {props.componentList
          ?props.componentList.map((item:any,index:number)=>{
            return (
              <NavLink to={item.path} key={index}	onMouseEnter={()=>setHover(index)} onMouseLeave={()=>setHover(-1)}>
                {({ isActive }) => (
                  <div className={`p-3 text-sm pageLink py-3 my-3 rounded-xl ${isActive?"bg-white text-custom-1":"text-white"}`}>
                    <div className="flex flex-row">
                      {item.icon?createElement(item.icon, {fill: (isActive || hover===index)?"rgba(80, 65, 188, 1)":"white"}):""}
                      <div className="mx-5">{item.name}</div>
                    </div>
                  </div>
                )}
              </NavLink>
            )
          })
          :<></>
        }
      </div>
    </div>
  )
}

export default SidePanel;