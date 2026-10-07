import "./app.css";
import Router, { Route } from "preact-router";
import { Home } from "./pages/home";
import { Destiny1PGCR } from "./pages/destiny1";
import { Destiny2PGCR } from "./pages/destiny2";

export function App() {
    return (
        <Router>
            <Route path="/" component={Home} />
            <Route path="/destiny1/:pgcrId" component={Destiny1PGCR} />
            <Route path="/destiny2/:pgcrId" component={Destiny2PGCR} />
            <Route default component={Home} />
        </Router>
    );
}
