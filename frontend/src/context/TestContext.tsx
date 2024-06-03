import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { setTestStore } from './TestStore';

const TestContext = React.createContext<null | any>(null);

export function TestProvider({ children }: any) {
    const testStore = useLocalStore(setTestStore);

    return <TestContext.Provider value={testStore} > {children}</TestContext.Provider >;
}

export const useTestStore = () => React.useContext(TestContext);

