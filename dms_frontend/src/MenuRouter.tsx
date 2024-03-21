import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu"

import TeamMembers from './components/TeamMembers';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Zones from './components/Zones';
import TeamTasks from './components/TeamTasks';
import { useState } from 'react';

export const MenuRouter = () => {
	const token = localStorage.getItem("Beacon-DMS-token");

	const [hover, setHover]= useState("text-white")
	return (
		<div className='relative'>
			<div style={{ width: "15%", float: "left", height: "100vh", position: "fixed", backgroundColor: "slateblue" }} >
				<div className='m-8'>
					<b className='text-lg'>{`<Company Name/Logo>`}</b>
					<div className='mt-36 ml-2'>
						
						<Link className="my-28 text-xl text-white pageLink pr-28 py-3 rounded-xl" to="/">Dashboard</Link>
						<br/>
						<Link className='my-3 text-xl text-white pageLink pr-28 py-3 rounded-xl' to="/products">Products</Link>

						<div className='my-3 text-xl text-white pageLink pr-28 py-3 rounded-xl'>
							<Link to="/zones">Zone/City</Link>
						</div>

						<div className="my-3 text-xl text-white pageLink pr-28 py-3 rounded-xl">
							<Link to="/team">Team Members</Link>
						</div>
						
						<div className='my-3 text-xl text-white pageLink pr-28 py-3 rounded-xl'>
							<Link to="/tasks">Team Tasks</Link>	
						</div>
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
