import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import Home from "./components/home.component"
import Subscribers from "./components/subscribers.component"
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-notifications/lib/notifications.css';
import EditInvoice from "./components/editInvoice.component"

function App() {
  return (
    <Router>
    <div className="container">
      <Navbar />
      <br/>
      <Route path="/" exact component={Home} />
      <Route path="/invoices" exact component={Home} />
      <Route path="/subscribers" exact component={Subscribers} />
      <Route path="/editInvoice/:id" component={EditInvoice}/>
    </div>
  </Router>
  );
}

export default App;
