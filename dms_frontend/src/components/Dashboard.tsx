//import useGlobalContext from "../../GlobalContext";

function Dashboard() {
	//const {getDecryptedToken} = useGlobalContext();

	/* const showToken = async () => {
		const res = await getDecryptedToken();
		console.log("Res",res);
	} */



	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/>
			{/* <div>
				<button className="mx-5" onClick={showToken}>Get token</button>
			</div> */}
			<br/>
		</div>
		
	)
}

export default Dashboard;