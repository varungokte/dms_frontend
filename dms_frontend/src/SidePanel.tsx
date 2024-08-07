import { createElement, useState } from "react";
import beacon_logo from "./components/static/beacon_logo.png";
import { NavLink } from 'react-router-dom';
import { ComponentList, FieldValues } from "DataTypes";
import useGlobalContext from './../GlobalContext';
import { sectionNames } from "./../Constants";

function SidePanel(props:{componentList:ComponentList|undefined, token:FieldValues|undefined}){
	const [hover,setHover] = useState(-1);
	const {editUser} = useGlobalContext();

  const fixPermissions = async () => {
    if (!props.token)
      return;
		const defaultPermissions:FieldValues={};
		Object.values(sectionNames).map(section=>defaultPermissions[section]=["access", "add", "edit","view","delete"]);
		defaultPermissions["team"].push("select")
		defaultPermissions["transaction"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["compliance"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["covenants"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["precedent"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}
		defaultPermissions["subsequent"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}

		defaultPermissions["payment"] = {
			docs: ["access","view","add","edit", "delete"],
			file: ["access","view","add","edit","delete"]
		}

		delete defaultPermissions["critical mst"];
		delete defaultPermissions["default mst"];

    const obj = {_id:props.token["_userId"], UP: defaultPermissions}
		console.log("UP",defaultPermissions)
    const res = await editUser(obj);
    console.log(res);
  }
  return (
    <div>
      <NavLink to={"/"} key={-1}	onMouseEnter={()=>setHover(-1)} onMouseLeave={()=>setHover(-1)}>
        <img src={beacon_logo} width={"250px"} className='m-auto p-3'/>
      </NavLink>
      <div className='mx-8 my-5'>

      <button onClick={fixPermissions}>Fix Permissions</button>
        {props.componentList
          ?props.componentList.map((item:any,index:number)=>{
            return (
              <NavLink to={item.path} key={index}	onMouseEnter={()=>setHover(index)} onMouseLeave={()=>setHover(-1)}>
                {({ isActive }) => (
                  <div className={`p-3 text-sm pageLink py-3 my-3 rounded-xl ${isActive?"bg-white text-custom-1":"text-white"}`}>
                    <div className='flex flex-row'>
                      {item.icon?createElement(item.icon, {fill: (isActive || hover===index)?"rgba(80, 65, 188, 1)":"white"}):""}
                      <div className="mx-5">{item.name}</div>
                    </div>
                  </div>
                )}
              </NavLink>
            )
          })
          :<></>}
      </div>
    </div>
  )
}

export default SidePanel;