import useGlobalContext from "../../GlobalContext";

function Dashboard() {
	const {getDecryptedToken} = useGlobalContext();

	const showToken = async () => {
		const res = await getDecryptedToken();
		console.log("Res",res);
	}
	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/>
			<div>
				<div><button onClick={showToken}>click</button></div>
			</div>
			<br/>
			<div>
			</div>
		</div>
		
	)
}

export default Dashboard;