import { Route, Routes } from "react-router";
import CreateLoadTest from "./components/CreateLoadTest";
import LoadTest from "./components/LoadTest";
import Layout from "./components/layout/Layout";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CreateLoadTest />} />
        <Route path="/:id" element={<LoadTest />} />
      </Route>

    </Routes>
  )
};

export default App;
