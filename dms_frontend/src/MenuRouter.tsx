import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "./components/ui/dropdown-menu"

import TeamMembers from './components/TeamMembers';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Zones from './components/Zones';
import TeamTasks from './components/TeamTasks';

export const MenuRouter = () => {
    return (
        <div style={{ position: "relative" }}>
            <div style={{ borderRight: "solid", width: "15%", float: "left", height: "100vh", position: "fixed", backgroundColor: "slateblue" }} className='bg-secondary-subtle'>
                <div style={{ margin: "2%" }}>
                    <b className='text-lg'>{`<Company Name/Logo>`}</b>
                    <div style={{ marginTop: "50%", marginLeft: "5%" }}>
                        <Link style={{ color: "white" }} className='text-xl' to="/">Dashboard</Link>
                        <br />
                        <Link style={{ color: "white" }} className='text-xl' to="/products">Products</Link>
                        <br />
                        <Link style={{ color: "white" }} className='text-xl' to="/zones">Zone/City</Link>
                        <br />
                        <Link style={{ color: "white" }} className='text-xl' to="/team">Team Members</Link>
                        <br />
                        <Link style={{ color: "white" }} className='text-xl' to="/tasks">Team Tasks</Link>
                        <br />
                    </div>
                </div>
            </div>
            <div style={{ width: "85%", margin: "auto", paddingLeft: "0%", paddingRight: "1%", float: "right" }}>
                <div className='relative h-20 w-100' style={{ backgroundColor: "white" }} >
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
