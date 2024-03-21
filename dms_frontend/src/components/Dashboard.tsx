import useGlobalContext from "../../GlobalContext";



function Dashboard() {

    const { isLoggedIn } = useGlobalContext();

    return (
        <div>This is the Dashboard {isLoggedIn() ? <>Logged In</> : <>Logged Out</>}</div>
    )
}

export default Dashboard;