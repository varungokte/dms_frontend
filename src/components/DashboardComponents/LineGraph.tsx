import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { IntervalType } from '@/types/DataTypes';

function LineGraph (props:{title:string,parameters:{name:string, data:number[]}[], xAxisLabels:string[], intervalType?:IntervalType, setIntervalType?:Function}) {

	const options: ApexOptions = {
		legend: {
			show: true,
			position: 'top',
			horizontalAlign: 'left',
		},
		//colors: ['#3C50E0', '#80CAEE'],
		chart: {
			fontFamily: 'Satoshi, sans-serif',
			height: 335,
			type: 'area',
			dropShadow: {
				enabled: true,
				color: '#623CEA14',
				top: 10,
				blur: 4,
				left: 0,
				opacity: 0.1,
			},
			zoom:{enabled:false},
			toolbar: {show:false},
		},
		responsive: [
			{
				breakpoint: 1024,
				options: {
					chart: {height: 300},
				},
			},
			{
				breakpoint: 1366,
				options: {
					chart: {height: 350},
				},
			},
		],
		stroke: {
			width: [2, 2],
			curve: 'straight',
		},
		// labels: {
		//   show: false,
		//   position: "top",
		// },
		grid: {
			xaxis: {lines: {show: true}},
			yaxis: {lines: {show: true}},
		},
		dataLabels: {enabled: false},
		markers: {
			size: 4,
			colors: '#fff',
			strokeColors: ['#3056D3', '#80CAEE'],
			strokeWidth: 3,
			strokeOpacity: 0.9,
			strokeDashArray: 0,
			fillOpacity: 1,
			discrete: [],
			hover: {
				size: undefined,
				sizeOffset: 5,
			},
		},
		xaxis: {
			type: 'category',
			categories: props.xAxisLabels,
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			title: {style: {fontSize: '0px'}},
			min: 0,
			max: 100,
		},
	};

 
  return (
    <div className="col-span-12 rounded-sm border border-stroke w-100 p-5 bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="m-auto flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
				<div className="font-semibold">{props.title}</div>
				{props.intervalType
					?<div className="flex justify-end">
						<ToggleButtonGroup exclusive color="secondary" value={props.intervalType} onChange={(_,val)=>{if (props.setIntervalType && val) props.setIntervalType(val)}}>
							<ToggleButton value="monthly">Monthly</ToggleButton>
							<ToggleButton value="yearly">Yearly</ToggleButton>
						</ToggleButtonGroup>
					</div>
					:<></>
				}
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={props.parameters}
            type="area"
						height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default LineGraph;
