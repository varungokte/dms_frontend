

function TeamTasks() {
  return (
    <div>
			<p className="text-3xl font-bold m-7">Team Tasks</p>
			<div className='flex flex-row relative'>
				<input type="text" className="border-2 mx-10 my-2" style={{borderRadius: "10px", padding:"20px"}} placeholder="Search"/>
        <select>
          <option>A</option>
        </select>
      </div>
    </div>
  )
}

export default TeamTasks;