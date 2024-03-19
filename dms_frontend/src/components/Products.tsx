import { useState } from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

function Products(){

	//An object where each key is the name of a product, and its corresponding value is an array of sub-products
	const [products, setProducts] = useState({
		"Capital Flex Advantage":["P1", "P2", "P3"],
		"Work Cash Solutions":["Work Cash Express Loan", "Work Cash FlexiCredit", "Work Cash Business Boost", "Work Cash Express Loan", "Work Cash FlexiCredit", "Work Cash Business Boost"],
		"Biz Boost Express": ["Product 1", "Product 2", "Product 3"],
		"Flexi Capital Max": ["Product Names", "Go Here", "You get the idea"],
		"Swift Capital Elite": ["Test Product 1", "Test Product 2"]
	});

	const [selected, setSelected] = useState(0);
	
	return(
		<div>
			<p className="text-3xl font-bold m-7">Products</p>
			<div className=''>
				<input type="text" className="border-2 mx-10 my-2" style={{borderRadius: "10px", padding:"20px"}} placeholder="Search Product"/>
			</div>

			<div className="flex flex-row relative m-10">
				<div style={{marginRight:"5%"}}>
				<Table className="rounded-2xl" style={{backgroundColor:"white"}}>
					<TableHeader>
						<TableRow>
							<TableHead className="text-xl">Product Name</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="border-none">
						{Object.keys(products).map((product, index)=>{
							return (
								<TableRow>
									<TableCell className="text-lg	tableCell" onClick={()=>{setSelected(index)}}>{product}</TableCell>
								</TableRow>
						)})}
					</TableBody>
					</Table>
				</div>

				<div className="grow mr-10">
					<Table className="flex-none rounded-2xl" style={{backgroundColor:"white"}}>
						<TableHeader>
							<TableRow>
								<TableHead className="text-xl">
									{//@ts-ignore
									Object.keys(products)[selected]}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{//@ts-ignore
							products[Object.keys(products)[selected]].map((product)=>{
								return (
								<TableRow>
									<TableCell className="text-lg	">{product}</TableCell>
								</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			</div>
	</div>
	
	)
}

export default Products;