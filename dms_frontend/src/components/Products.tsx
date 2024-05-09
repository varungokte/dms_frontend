import { useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import Search from "./BasicComponents/Search";

import useGlobalContext from "./../../GlobalContext";

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
	const [searchString, setSearchString] = useState("");

	const {useTitle} = useGlobalContext();

	useTitle("Products")
	
	return(
		<div>
			<p className="text-3xl font-bold m-7">Products</p>
			<div className=''>
				<Search setter={setSearchString} label="Search"/>
			</div>

			<div className="flex flex-row relative m-10">
				<div className="mr-9">
				<Table className="rounded-2xl bg-white">
					<TableHeader>
						<TableRow>
							<TableHead className="text-xl">Product Name</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="border-none">
						{Object.keys(products).map((product, index)=>{
							return (
								<TableRow className="border-none">
									<TableCell className={`text-lg	tableCell ${selected===index?"text-blue-600 bg-slate-200":""}`} onClick={()=>{setSelected(index)}}>{product}</TableCell>
								</TableRow>
						)})}
					</TableBody>
					</Table>
				</div>

				<div className="grow mr-10">
					<Table className="flex-none rounded-2xl bg-white">
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
								<TableRow className="border-none">
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