import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useDropzone} from "react-dropzone";

function Dashboard() {	
	const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
	
	const files = acceptedFiles.map((file,index) => (
    <li key={index}>
      {file.name} - {file.size} bytes
    </li>
  ));
	
	return (
		<div>
			<div className="text-center my-4 font-bold text-5xl text-custom-1">DASHBOARD</div>
			<br/>
			<div>
				<section className="container">
					<div {...getRootProps({className: 'dropzone'})}>
						<input {...getInputProps()} />
						<p>Drag 'n' drop some files here, or click to select files</p>
					</div>
					<aside>
						<h4>Files</h4>
						<ul>{files}</ul>
					</aside>
				</section>
				<div>
					<Link to="view/data.pdf">GO </Link>	
				</div>
			</div>
		</div>
		
	)
}

export default Dashboard;