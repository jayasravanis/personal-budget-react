import { Link } from "react-router-dom";

function Menu() {
  return (
    <header>
        <nav className="menu">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="https://google.com" target="_blank">Google</Link></li>
            </ul>
        </nav>
    </header>
  );
}

export default Menu;
