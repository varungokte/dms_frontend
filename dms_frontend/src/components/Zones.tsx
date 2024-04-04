import { useState } from "react";

import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import Search from "./BasicComponents/Search";
import Filter from "./BasicComponents/Filter";

function Zones() {
	const [zones, setZones] = useState({
		"West & East Zone": [50, 1000, 122],
		"South Zone": [21.22,3.1415926, 80],
		"The Neutral Zone": [75,2,3],
		"South East Zone": [100,0.0005,98],
		"The Zone No One Talks About": [1,90,1]
	});
	
	const [currentZone, setCurrentZone] = useState(-1);

    //An object where the 
    //key: zone name
    //value: array where [percent_complete, money(in crores of INR), total_number_of_facilities] NOTE all of these are of Number type
  
		//Currency array: [currency(INR,USD,etc.), amount(crore,billion,etc.)]
		const [currency, setCurrency] = useState(["INR", "Cr."])

		//An array of arrays for details of a specific zone: [deal_1, deal_2, deal_3] where each deal is an array 
		//Single deal details: [deal_id, deal_name, monitoring_manager, start_date]
		const [zoneDetails, setZoneDetails] = useState([
			[1,"Loan Company", "Loan Person", "01/01/01"],
			[2,"Construction Company", "Construction Person", "02/02/02"]
		]);

		const [searchString, setSearchString] = useState("");

    return (
			<div>
				<p className="text-3xl font-bold m-7">{currentZone==-1?"Zones":Object.keys(zones)[currentZone]}</p>
				<div className="flex flex-row">
					<div className=''>
          <Search setter={setSearchString} label="Search"/>
					</div>
					
					<div>
						<Filter setter={setCurrentZone} listsAreSame={true} labelList={Object.keys(zones)} setPlaceholder={true} placeholderValue={[-1, "All Zones"]} />
					</div>
				</div>

				<div className="flex flex-row flex-wrap mx-10">
					{currentZone==-1? <AllZones zones={zones} setter={setCurrentZone} currency={currency}/> : <SingleZone zoneDetails={zoneDetails} />}
				</div>
			</div>
    )
};

function AllZones(props:any){
	const [zones] = useState(props.zones);
	const [currency] = useState(props.currency)
	
	return(
		Object.keys(zones).map((zone,index)=>{
		return(
			<Card style={{width:"48vh", marginRight:"5%", marginBottom:"3%", borderRadius:"20px", backgroundColor:"white"}}>
				<CardHeader>
					<CardTitle></CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-row ">
						<div style={{width:150, height:150}}>
							<CircularProgressbar value={/* @ts-ignore */ zones[zone][0]} text={zones[zone][0]}/>
						</div>

						<div className="mx-5">
							<p className="text-xl">{zone}</p>
							<br/>
							<p className="font-bold text-lg">{/* @ts-ignore */ `${currency[0]} ${zones[zone][1]} ${currency[1]}`}</p>
							<p className="text-lg">{/* @ts-ignore */`Total Facilities: ${zones[zone][2]}`}</p>
						</div>
					</div>
					
				</CardContent>
				<CardFooter>	
					<button className="text-custom-1 m-auto" onClick={()=>{props.setter(index); /* setZoneDetails(Fetch Zone Details) */}}>View All {`->`}</button>	
				</CardFooter>
			</Card>
		)
	}))
};

function SingleZone(props:any){
	return(
		<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Deal ID</TableHead>
							<TableHead>Deal Name</TableHead>
							<TableHead>Monitoring Manager</TableHead>
							<TableHead className="text-right">Start Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{props.zoneDetails.map((deal:any)=>{
							return(
								<TableRow>
								<TableCell className="font-medium">{deal[0]}</TableCell>
								<TableCell>{deal[1]}</TableCell>
								<TableCell>{deal[2]}</TableCell>
								<TableCell className="text-right">{deal[3]}</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
	)
}

export default Zones;