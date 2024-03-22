import './App.css';
import { Routes, Route, Link, NavLink } from 'react-router-dom';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu"

import TeamMembers from './components/TeamMembers';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Zones from './components/Zones';
import TeamTasks from './components/TeamTasks';
import { useState } from 'react';

export const MenuRouter = () => {

	const [currLink, setCurrLink] = useState("Dashboard");
	const [currColor, setCurrColor] = useState("slateblue");

	return (
		<div className='relative'>
			<div style={{ width: "15%", float: "left", height: "100vh", position: "fixed", backgroundColor: "slateblue" }} >
				<div className='m-8'>
					<b className='text-lg'>{`<Company Name/Logo>`}</b>
					<div className='mt-36 ml-2' >
						<NavLink to="/" style={({isActive,})=>{
							if (isActive)setCurrColor("white")
							else setCurrColor("slateblue");
							return isActive?{ color:"slateblue"}:{color:"white"}
						}}>
							<div className='p-3 text-xl pageLink pr-10 py-3 rounded-xl' style={{backgroundColor: currColor}}>Dashboard</div>
						</NavLink>
						
						<Link to="/products">
							<div className='p-3 text-xl text-white pageLink pr-10 py-3 rounded-xl'>Products</div>
						</Link>
						
						<Link to="/zones">
							<div className='p-3 text-xl text-white pageLink pr-10 py-3 rounded-xl'>Zone/City</div>
						</Link>
						
						<Link to="/team">
							<div className='p-3 text-xl text-white pageLink pr-10 py-3 rounded-xl'>Team Members</div>
						</Link>
						
							<Link to="/tasks">
								<div className='p-3 text-xl text-white pageLink pr-10 py-3 rounded-xl'>Team Tasks</div>
							</Link>	
						</div>
				</div>
			</div>
			<div style={{ width: "85%", margin: "auto", paddingLeft: "0%", paddingRight: "1%", float: "right" }}>
				<div className='relative h-20 w-100 bg-white'>
					<div className=' absolute inset-y-5 right-0 w-50'>
						<DropdownMenu>
							<DropdownMenuTrigger className='mb-3 pt-3'>
								<span>You're logged in as: <span className='mt-2 text-blue-600'>Admin Person</span></span>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem><b>Logout</b></DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<hr />
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/products" element={<Products />} />
					<Route path='/zones' element={<Zones />} />
					<Route path="/team" element={<TeamMembers />} />
					<Route path="/tasks" element={<TeamTasks />} />
					<Route path="/*" element={<>Not Found</>} />
				</Routes>
			</div>
		</div>

	)
}
