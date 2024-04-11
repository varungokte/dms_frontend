import { useState } from "react";

import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table } from "@/components/ui/table"
import Search from "./BasicComponents/Search";
import Filter from "./BasicComponents/Filter";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";

function Zones() {
	const [zones, setZones] = useState({
		"West & East Zone": [50, 1000, 122],
		"South Zone": [21.22,3.1415926, 80],
		"The Neutral Zone": [75,2,3],
		"South East Zone": [100,0.0005,98],
		"The Zone No One Talks About": [1,90,1]
	});
	
	const [currentZone, setCurrentZone] = useState("");

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
		Object.keys(zones).map((zone)=>{
			const regEx = new RegExp(props.searchString, "i")
			if (zone.search(regEx)!==-1)
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
							<button className="text-custom-1 m-auto" onClick={()=>{props.setter(zone); /* setZoneDetails(Fetch Zone Details) */}}>View All {`->`}</button>	
						</CardFooter>
					</Card>
				)
	}))
};

function SingleZone(props:any){
	return(
	<Table>
		<HeaderRows headingRows = {[["Deal Id", "w-[100px"], ["Deal Name"], ["Monitoring Manager"], ["Start Date", "text-right"]]} />
		<BodyRowsMapping list={props.zoneDetails} cellClassName={["font-medium","","","text-right"]} dataType={["text", "text", "text", "text"]} searchRows={[]} filterRows={[]}  />
	</Table>
	)
}

export default Zones;