import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

function SidePanel(){
	return(
		<div style={{borderRight: "solid", width: "15%",float:"left", height:"100vh", position:"fixed"}} className='bg-secondary-subtle'>
			<div style={{margin: "2%"}}>
				<b className='text-lg'>{`<Company Name/Logo>`}</b>
				<div style={{marginTop: "5%", marginLeft: "5%"}}>
				<p className='text-blue-600	'>Upcoming Deadlines</p>
				<p className='text-blue-600	'>Nuclear Launch Codes</p>
				<p className='text-blue-600	'>More Stuff...</p>
				</div>
			</div>
		</div>
    )
}
export default SidePanel;