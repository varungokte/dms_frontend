
import CardDataStats from '../Charts/CardDataStats';
import ChartOne from '../Charts/ChartOne';
import ChartThree from '../Charts/ChartThree';
import ChartTwo from '../Charts/ChartTwo';
import ChatCard from '../Chat/ChatCard';
import TableOne from '../Tables/TableOne';


const DashboardComponent = () => {
    return (
        <div className='p-10'>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>

                </CardDataStats>
                <CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp>

                </CardDataStats>
                <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp>

                </CardDataStats>
                <CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown>

                </CardDataStats>

            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartOne />
                <ChartTwo />
                <ChartThree />
                <ChatCard />

                <div className="col-span-12 xl:col-span-8">
                    <TableOne />
                </div>
            </div>
        </div>
    );
};

export default DashboardComponent;
