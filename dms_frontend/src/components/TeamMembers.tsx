import { useState } from "react";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem,	NavigationMenuLink,	NavigationMenuList,	NavigationMenuTrigger,} from "./ui/navigation-menu"
import { Button } from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"



function TeamMembers() {

	//An object where each key is the category of people, and the value is an array of the people in that category
	const [members, setMembers] = useState({
		"Chief Executive Officers":["Jean-Luc Picard", "William Riker"],
		"Relationship Managers": ["Deanna Troi", "Beverly Crusher", "Worf"],
		"My Team Members": ["?"]
	})
	
	return(
		<div>
			<p className="text-3xl font-bold m-7">Team Members</p>

			<div className='flex flex-row relative'>
				<div className=''>
					<input type="text" className="border-2 mx-10 my-2" placeholder="Search"/>
				</div>
				
				<div className=''>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger>{Object.keys(members)[0]}</NavigationMenuTrigger>
							<NavigationMenuContent>
								{Object.keys(members).map((designation)=>{
									return (
										<div>
											<NavigationMenuLink className="w-5">{designation}</NavigationMenuLink>
											<br/>
										</div>
										)
								})}	
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>	
				</div>

				<div className="absolute top-0 right-0">
					<span>{`${Object.values(members).map((value)=>{return value.length}).reduce((accumulator, curr)=>accumulator+curr)} members`}</span>
					<Dialog >
						<DialogTrigger className="m-5">Add new Member</DialogTrigger>
						<DialogContent className="bg-white">
							<DialogHeader>
								<DialogTitle>Add a Team Member</DialogTitle>
								<DialogDescription>
									<div>
										<label htmlFor="name">Name</label>
										<br/>
										<input id="name" className="border-2 mb-5"/>
									</div>
									
									<div>
										<label htmlFor="role">Role</label>
										<br/>
										<select id="role">
											<option value="maker">Maker</option>
											<option value="checker">Checker</option>
										</select>
									</div>

									<div>
										<button>Cancel</button>
										<button>Add</button>
									</div>
									
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<div className="mx-10 mt-8">
				{Object.keys(members).map((category: string)=>{
					return(
						<div>
							<p>{category}</p>
							<div className="flex flex-row">
								{//@ts-ignore
								members[category].map((member)=>{
									return (
										<div className="m-2">
											<Card>
												<CardHeader>
													<CardTitle>{member}</CardTitle>
												</CardHeader>
												<CardContent>
													<p>{category}</p>
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