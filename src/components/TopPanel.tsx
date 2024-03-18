import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"



function TopPanel() {
	return(
		<div className='d-flex mb-2' >
			<div className='p-2 flex-fill'>
			</div>
			<div className=' mx-5 flex'>
				<DropdownMenu>
					<DropdownMenuTrigger className='mb-3 pt-3'>
						<span>You're logged in as: <span className='mt-2 link-primary'>Admin Person</span></span>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem><b>Logout</b></DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}

export default TopPanel