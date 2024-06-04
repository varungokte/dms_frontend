import { useState } from "react";

import {Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import FormDialog from "../BasicComponents/FormDialog";

import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import Search from "../BasicComponents/Search";
import ProfileIcon from "../BasicComponents/ProfileIcon";
import Filter from "../BasicComponents/Filter";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import useGlobalContext from "../../../GlobalContext";

function TeamMembers() {
	const {id} =  useParams();
	const navigate = useNavigate();

	const {useTitle} = useGlobalContext();

	useTitle(id || "Team Members")

	//An object where each key is the category of people, and the value is an array of the people in that category
	const [members] = useState({
		"Chief Executive Officers":["Jean-Luc Picard", "William Riker"],
		"Relationship Managers": ["Deanna Troi", "Beverly Crusher", "Worf"],
		"My Team Members": ["?"]
	});

	const [newName, setNewName] = useState("");
	const [newRole, setNewRole] = useState(-1);
	const [searchString, setSearchString] = useState("");

	console.log(newName,newRole,searchString)

	const addMember = () =>{
	}
	
	return(
		<div>
			<p className="text-3xl font-bold m-7"><button onClick={()=>navigate("/teams")}><ChevronLeft className="mt-1"/></button>  Team Members</p>

			<div className='flex flex-row relative'>
				<div className=''>
          <Search setter={setSearchString} label="Search"/>
				</div>
				
				<div className='flex-auto'>
					<Filter setter={setSearchString} listsAreSame={true} labelList={Object.keys(members)} setPlaceholder={false} />
				</div>

				<div className="">
					<span className="font-light">{`${Object.values(members).map((value)=>{return value.length}).reduce((accumulator, curr)=>accumulator+curr)} members`}</span>
					<FormDialog
						triggerText={<><span className="text-xl">+ </span><span>Add Member</span></>} triggerClassName={CreateButtonStyling}
						formTitle="Add Team Member" formSubmit= {addMember} submitButton= "Create User"  formSize="small"
						form= {[
							{ category: "single", label: "Name", type: "text", setter: setNewName },
							{ category: "single", label: "Role", type: "select", setter: setNewRole, options: ["Maker", "Checker"] }
						]}
					/>
				</div>
			</div>

			<div className="mx-10 mt-5">
				{Object.keys(members).map((category: string, index)=>{
					return(
						<div key={index+category}>
							<p key={index+category+"category"} className="text-lg font-semibold">{category}</p>
							<div key={index+category+"a"} className="flex flex-row">
								{//@ts-ignore
								members[category].map((member,index)=>{
									return (
										<Card key={index} className="m-5 rounded-2xl bg-white w-72">
											<CardHeader key={index+"head"}>
												<CardTitle key={index+"title"} className="m-auto">
													<ProfileIcon key={index+"icon"} name={member} size="large" />
												</CardTitle>
											</CardHeader>
											<CardContent key={index+"content"}>
												<p key={index+"name"} className="text-center font-medium">{member}</p>
												<p key={index+"role"} className="text-center font-light">{category}</p>
											</CardContent>
										</Card>
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