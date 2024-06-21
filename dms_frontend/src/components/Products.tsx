import { useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";
import { FieldValues } from "./../../DataTypes";
import { LoanProductList } from "./../../Constants";

import Filter from "./BasicComponents/Filter";
import { Table } from "./ui/table";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";

function Products(){
	const [loanList, setLoanList] = useState<FieldValues[]>();
	const [products, setProducts] = useState<string[]>([]);

	const {useTitle, getLoanList} = useGlobalContext();

	useTitle("Products");

	useEffect(()=>{
		setLoanList(undefined);
		getLoanList("P",products.length==0?[]:products).then(res=>{
			console.log("response",res)
			if (res.status==200)
				setLoanList(res.arr);
			else
				setLoanList([])
		})
	},[products]);
	
	return(
		<div className="m-5">
			<p className="text-3xl font-bold m-7">Products</p>
			<div className="flex flex-row mx-7">
				<div className="flex-auto"><Filter value={products} setValue={setProducts} options={LoanProductList} placeholderValue="Products" multiple /> </div>
			</div>

			<div className="bg-white mx-7 my-5">
				{loanList
					?loanList.length==0
						?<span><br/><EmptyPageMessage sectionName="loans" /></span>
						:<Table>
							<HeaderRows headingRows={["Sr. No.", "Agreement ID", "Company Name", "Group Name", "Zone", "Sanction Amount"]} headingClassNames={["w-[100px]","text-center","text-center","text-center","text-center","text-center"]} />
							<BodyRowsMapping list={loanList} columns={["AID", "CN", "GN", "Z", "SA"]}  dataType={["index","text","text","text","text","text"]}  cellClassName={["font-medium text-center", "text-center text-custom-1","text-center","text-center","text-center","text-center"]} />
						</Table>
					:<span><br /> <LoadingMessage sectionName="data" /></span>
				}
				<br />
			</div>
		</div>
	)
}

export default Products;