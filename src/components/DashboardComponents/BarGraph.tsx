import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { ApexOptions } from 'apexcharts';
import { IntervalType } from '@/types/DataTypes';
import ReactApexChart from 'react-apexcharts';

function BarGraph(props:{title:string, parameters:{name:string, data:number[]}[], xAxisLabels:string[], intervalType?:IntervalType, setIntervalType?:Function}){
  const options: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: "bar",
      height: 335,
      stacked: true,
      toolbar: {show: false},
      zoom: {enabled: false},
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {plotOptions: {bar: {borderRadius: 0,columnWidth: '25%'}}},
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {enabled: false},
    xaxis: {categories: props.xAxisLabels},
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
    },
    fill: {opacity: 1},
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke w-100 p-5 bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          {props.title}
        </h4>
        {props.intervalType
          ?<Select value={props.intervalType} onChange={(e)=>{if (props.setIntervalType)props.setIntervalType(e.target.value)}}>
            <MenuItem value={"monthly"}>Monthly</MenuItem>
            <MenuItem value={"yearly"}>Yearly</MenuItem>
          </Select>
          :<></>
        }
      </div>

      <div>
        <div className="-ml-5 -mb-9">
          <ReactApexChart type="bar"
            options={options} series={props.parameters}
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default BarGraph;