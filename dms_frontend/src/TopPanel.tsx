import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FieldValues } from "DataTypes";

import ProfileIcon from './components/BasicComponents/ProfileIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

type TopPanelProps = {
  token: FieldValues|undefined,
  socketIsConnected:boolean
}

function TopPanel(props:TopPanelProps){
	const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  }
  
  const logoutUser = () => {
		localStorage.removeItem("Beacon-DMS-token");
		navigate("/login");
	}

  return (
    <div className='relative h-20 w-100 bg-white'>
      <div className=' absolute inset-y-5 right-0 w-50'>
        {props.token
          ?<div className="float-right">
            <button className="flex flex-row" onClick={handleClick} id="info">
              <div><ProfileIcon name={props.token["N"]||"User"} size="small" showStatus={props.socketIsConnected}/></div>
              <div className="text-left mx-3">
                <p>{props.token["N"]}</p>
                <p className="font-light">{props.token["R"]||props.token["E"]||""}</p>
              </div>
            </button>
            <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
              <MenuItem divider><Link to="user">Profile</Link></MenuItem>
              <MenuItem><button onClick={logoutUser}>Logout</button></MenuItem>
            </Menu>
          </div>
          :<p>Loading</p>
        }
      </div>
    </div>
  )
}

export default TopPanel;