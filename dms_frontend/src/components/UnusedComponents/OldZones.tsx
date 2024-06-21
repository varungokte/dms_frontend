/* import { useState } from "react";

import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table } from "@/components/ui/table"
import Search from "./BasicComponents/Search";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import useGlobalContext from "../../GlobalContext";

function Zones() {
	const [zones] = useState({
		"West & East Zone": [50, 1000, 122],
		"South Zone": [21.22,3.1415926, 80],
		"The Neutral Zone": [75,2,3],
		"South East Zone": [100,0.0005,98],
		"The Zone No One Talks About": [1,90,1]
	});

	const {useTitle} = useGlobalContext();

	useTitle("Zones");
	
	const [currentZone, setCurrentZone] = useState("");
	const [currency] = useState(["INR", "Cr."])

	const [zoneDetails] = useState([
		{ AID:1, CN:"Loan Company" },
		{ AID:2,	CN:"Construction Company" }
	]);

	const [searchString, setSearchString] = useState("");

	return (
		<div>
			<p className="text-3xl font-bold m-7">{currentZone==""?"Zones":currentZone}</p>
			<div className="flex flex-row">
				<div className=''>
				<Search setter={setSearchString} label="Search"/>
				</div>
				
				<div>
					<Filter currentValue={currentZone} setter={setCurrentZone} listsAreSame={true} labelList={Object.keys(zones)} setPlaceholder={true} placeholderValue={["", "All Zones"]} />
				</div>
			</div>

			<div className="flex flex-row flex-wrap mx-10">
				{currentZone==""? <AllZones zones={zones} searchString={searchString} setter={setCurrentZone} currency={currency}/> : <SingleZone setter={setCurrentZone} zoneDetails={zoneDetails} />}
			</div>
		</div>
	)
};

function AllZones(props:any){
	const [zones] = useState(props.zones);
	const [currency] = useState(props.currency)
	
	return(
		Object.keys(zones).map((zone, index)=>{
			const regEx = new RegExp(props.searchString, "i")
			if (zone.search(regEx)!==-1)
				return(
					<Card key={index+"c"} style={{width:"48vh", marginRight:"5%", marginBottom:"3%", borderRadius:"20px", backgroundColor:"white"}}>
						<CardHeader key={index+"h"}>
							<CardTitle key={index+"t"}></CardTitle>
						</CardHeader>
						<CardContent key={index+"c"}>
							<div key={index+"cdiv"} className="flex flex-row ">
								<div key={index+"pie"} style={{width:150, height:150}}>
									<CircularProgressbar value={zones[zone][0]} text={zones[zone][0]}/>
								</div>
								<div className="mx-5" key={index+"i"}>
									<p className="text-xl" key={index+"n"}>{zone}</p>
									<br/>
									<p className="font-bold text-lg" key={index+"v"}>{`${currency[0]} ${zones[zone][1]} ${currency[1]}`}</p>
									<p className="text-lg" key={index+"f"}>{`Total Facilities: ${zones[zone][2]}`}</p>
								</div>
							</div>
						</CardContent>
						<CardFooter>	
							<button className="text-custom-1 m-auto" onClick={()=>{props.setter(zone);}}>View All {`->`}</button>	
						</CardFooter>
					</Card>
				)
	}))
};

function SingleZone(props:any){
	return(
	<Table>
		<HeaderRows headingRows = {["Deal Id", "Deal Name", "Start Date"]}
			headingClassNames={["w-[100px","","text-right"]} 
		/>
		<BodyRowsMapping list={props.zoneDetails} columns={["AID", "CN","SD"]} 
			cellClassName={["font-medium","","","text-right"]} dataType={["text", "text", "text", "text"]} 
			searchRows={[]} filterRows={[]}  
		/>
	</Table>
	)
}

export default Zones; */