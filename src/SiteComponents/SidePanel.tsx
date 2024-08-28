import { createElement, useState } from "react";
import beacon_logo from "@/static/beacon_logo.png";
import { NavLink } from "react-router-dom";
import { FieldValues } from "@/types/DataTypes";
import { ComponentList } from "@/types/ComponentProps";
import useGlobalContext from "@/functions/GlobalContext";
import { sectionNames } from "@/functions/Constants";
import { Tooltip, Typography } from "@mui/material";

function SidePanel(props:{componentList:ComponentList|undefined, token:FieldValues|undefined}){
	const [hover,setHover] = useState(-1);
	const {editUser} = useGlobalContext();

  const fixPermissions = async () => {
    if (!props.token)
      return;
    const allPermissions = ["access", "add", "edit", "view", "delete"];
		const defaultPermissions:FieldValues={};
		Object.values(sectionNames).map(section=>defaultPermissions[section]=allPermissions);
		defaultPermissions["team"].push("select")
		defaultPermissions["transaction"] = {
			docs: allPermissions,
			file: allPermissions
		}
		defaultPermissions["compliance"] = {
			docs: allPermissions,
			file: allPermissions
		}
		defaultPermissions["covenants"] = {
			docs: allPermissions,
			file: allPermissions
		}
		defaultPermissions["precedent"] = {
			docs: allPermissions,
			file: allPermissions
		}
		defaultPermissions["subsequent"] = {
			docs: allPermissions,
			file: allPermissions
		}

		defaultPermissions["payment"] = {
			docs: allPermissions,
			file: allPermissions
		}

		delete defaultPermissions["critical mst"];
		delete defaultPermissions["default mst"];

    const obj = {_id:props.token["_userId"], UP: defaultPermissions}
		const res = await editUser(obj);
    console.log(res);
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