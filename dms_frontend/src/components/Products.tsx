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
					<input type="text" className="border-2 mx-10 my-2" placeholder="Search Product"/>
				</div>

				<div className="flex flex-row relative ml-5">
					<div style={{marginRight:"5%"}}>
					<Table className="border-2 rounded-3xl">
							<TableHeader>
								<TableRow>
									<TableHead className="text-xl">Product Name</TableHead>
									</TableRow>
							</TableHeader>
							<TableBody className="border-none">
								{Object.keys(products).map((product)=>{
									return (
										<TableRow>
											<TableCell className="text-lg	">{product}</TableCell>
										</TableRow>
									)})}
							</TableBody>
						</Table>
					</div>

					<div className="grow mr-10">
						<Table>
							<TableCaption>A list of your recent invoices.</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Invoice</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Method</TableHead>
									<TableHead className="text-right">Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium">INV001</TableCell>
									<TableCell>Paid</TableCell>
									<TableCell>Credit Card</TableCell>
									<TableCell className="text-right">$250.00</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
		</div>
		
	)
}

export default Products;