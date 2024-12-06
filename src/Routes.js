import { Route } from "react-router-dom";
import Login from "./Login";
import Menu from "./Menu";

function Routes(){
    return (
    <Router>
        <Routes>
            <Route path="/Login" element={<Login/>}></Route>
            <Route path="/Menu" element={<Menu/>}></Route>
        </Routes>
    </Router>

    )
}

export default Routes;