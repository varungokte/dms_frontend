import { useState } from "react";

import {Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Dialog, DialogTrigger, } from "@/components/ui/dialog";
import DialogForm from "./BasicComponents/DialogForm";

function TeamMembers() {

	//An object where each key is the category of people, and the value is an array of the people in that category
	const [members, setMembers] = useState({
		"Chief Executive Officers":["Jean-Luc Picard", "William Riker"],
		"Relationship Managers": ["Deanna Troi", "Beverly Crusher", "Worf"],
		"My Team Members": ["?"]
	});

	const [newName, setNewName] = useState("");
	const [newRole, setNewRole] = useState(-1);

	const addMember = () =>{

	}
	
	return(
		<div>
			<p className="text-3xl font-bold m-7">Team Members</p>

			<div className='flex flex-row relative'>
				<div className=''>
					<input type="text" className="border-2 mx-10 my-2 p-3 w-72 rounded-xl" placeholder="Search"/>
				</div>
				
				<div className='flex-auto'>
					<select className="mt-2 p-4 bg-white border-2 w-72 rounded-xl">
					{Object.keys(members).map((designation)=>{
						return (
							<option value={designation}>{designation}</option>
							)
					})}
					</select>	
				</div>

				<div className="">
					<span className="font-light">{`${Object.values(members).map((value)=>{return value.length}).reduce((accumulator, curr)=>accumulator+curr)} members`}</span>
					<Dialog >
						<DialogTrigger className="m-5 p-3 bg-custom-1 text-white rounded-xl"><span className="text-xl">+</span> Add Member</DialogTrigger>
						<DialogForm
							title="Add Team Member"
							formSubmit= {addMember}
							submitButton= "Create User"
							form= {[
								{
									category: "single",
									label: "Name",
									type: "text",
									setter: setNewName
								},
								{
									category: "single",
									label: "Role",
									type: "select",
									setter: setNewRole,
									options: ["Maker", "Checker"]
								}
							]}
						/>
					</Dialog>
				</div>
			</div>

			<div className="mx-10 mt-5">
				{Object.keys(members).map((category: string)=>{
					return(
						<div>
							<p className="text-lg font-semibold">{category}</p>
							<div className="flex flex-row">
								{//@ts-ignore
								members[category].map((member)=>{
									return (
										<div >
											<Card className="m-5 rounded-2xl bg-white w-72">
												<CardHeader>
													<CardTitle className="m-auto">
														<div style={{height:"100px", width:"100px", lineHeight:"100px", borderRadius:"50%", textAlign:"center", fontSize:"30px", backgroundColor: "goldenrod", color:"white"}}>{member.split(" ").map((name:String)=>{return name[0]})}</div>
													</CardTitle>
												</CardHeader>
												<CardContent>
													<p className="text-center font-medium">{member}</p>
													<p className="text-center font-light">{category}</p>
												</CardContent>
											</Card>
										</div>
									)})}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default TeamMembers;