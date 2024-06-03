import { Form, FormSection, FormSectionItem } from './ui/Forms'
import { EndpointInput, Input, Label, Select, HeaderInput } from './ui/Input';
import { observer } from 'mobx-react-lite';
import { useTestStore } from '../context/TestContext';
import { toJS } from 'mobx';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from './ui/Buttons';
import qs from 'qs';

const CreateLoadTest = observer(() => {

    const testStore: any = useTestStore();
    const navigate = useNavigate();

    const selectItems = [{ name: 'GET', value: 'GET' }, { name: 'POST', value: 'POST' }, { name: 'PUT', value: 'PUT' }, { name: 'DELETE', value: 'DELETE' }]

    const createLoadTest = async (event: any) => {
        event.preventDefault();
        console.log('Creating load test with data:', toJS(testStore.config), toJS(testStore.endpoints));
        const data = { config: testStore.config, headers: testStore.headers, endpoints: testStore.endpoints }
        // create query string with data
        const queryString = qs.stringify(data);
        console.log('Query string:', queryString);
        // send data to server
        navigate('/load-test' + '?' + queryString);
    }


    return (
        <>
            <header>
                <div className="mx-auto max-w-7xl my-10">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Create API Load Test</h1>
                </div>
            </header>

            <Form submitLabel='Start Test' cancelLabel='Clear' onSubmit={createLoadTest}>
                <FormSection headline="Config">
                    <FormSectionItem>
                        <Label label="Base URL" />
                        <Input type="text" name="baseUrl" id="BaseUrl" placeholder="https://example.com" defaultValue="" disabled={false} required={true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => testStore.handleInputChange(e.target.value, e.target.id)} />
                    </FormSectionItem>
                    <FormSectionItem>
                        <Label label="Duration (seconds)" />
                        <Input type="number" name="duration" id="DurationInSeconds" placeholder="60" defaultValue="" disabled={false} required={true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => testStore.handleInputChange(e.target.value, e.target.id)} />
                    </FormSectionItem>
                    <FormSectionItem>
                        <Label label="RPS" />
                        <Input type="number" name="rps" id="RequestsPerSecond" placeholder="10" defaultValue="" disabled={false} required={true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => testStore.handleInputChange(e.target.value, e.target.id)} />
                    </FormSectionItem>
                    <FormSectionItem>
                        <Label label="Use statistical distribution" />
                        <Select name="distribution" id="UseStatisticalDistribution" value={testStore.config.UseStatisticalDistribution} items={[{ name: 'true', value: 'true' }, { name: 'false', value: 'false' }]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => testStore.handleInputChange(e.target.value, e.target.id)} />
                    </FormSectionItem>
                    <FormSectionItem>
                        <Label label="Headers" />
                        <PrimaryButton label="Add Header" onClick={() => testStore.addHeader()} />
                        <div className='my-2'></div>
                        <div className=' space-y-2'>
                            {testStore.headers.map((header: any) => (
                                <HeaderInput key={header.id} header={header} />
                            ))}
                        </div>
                    </FormSectionItem>
                </FormSection>

                <FormSection headline="Endpoints">


                    <FormSectionItem >
                        <PrimaryButton label="Add Endpoint" onClick={() => testStore.addEndpoint()} />
                        <div className='my-2'></div>
                        <div className=' space-y-2'>
                            {testStore.endpoints.map((endpoint: any) => (
                                <EndpointInput key={endpoint.id} endpoint={endpoint} selectItems={selectItems} />
                            ))}
                        </div>

                    </FormSectionItem>

                </FormSection>
            </Form>
        </>
    )
})

export default CreateLoadTest;