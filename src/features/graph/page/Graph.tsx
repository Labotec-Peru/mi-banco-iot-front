import PageContainer from '../../../layouts/PageContainer';

import StatsRow from '../../dashboard/components/StatsRow';

import Lecturas from './Lecturas';

export default function WaterMeterDashboard() {

    return (
        <PageContainer>
            <StatsRow />                           
            <Lecturas />
        </PageContainer>
    );
}