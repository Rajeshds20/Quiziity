import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/NavBar.css';
import TextLogo from '../assets/images/TextLogo.png';
import { useUser } from '../config/UseUser';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, darkTheme } = useUser();

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        // <nav className={`navbar ${isOpen ? 'active' : ''}`}>
        //     <div className="container">
        //         <Link to="/" className="logo">
        //             <img className='logo-img' src={TextLogo} alt="logo" />
        //         </Link>
        //         <div className={`menu-toggle ${isOpen ? 'active' : ''}`} onClick={handleToggle}>
        //             <div className="bar"></div>
        //             <div className="bar"></div>
        //             <div className="bar"></div>
        //         </div>
        //         <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
        //             <li className="nav-item">
        //                 <Link to="/" onClick={handleToggle}>Home</Link>
        //             </li>
        //             <li className="nav-item">
        //                 <Link to="/about" onClick={handleToggle}>About</Link>
        //             </li>
        //             <li className="nav-item">
        //                 <Link to="/services" onClick={handleToggle}>Services</Link>
        //             </li>
        //             <li className="nav-item">
        //                 <Link to="/contact" onClick={handleToggle}>Contact</Link>
        //             </li>
        //             <li className="nav-item">
        //                 <button className='logout-button-nav' onClick={() => {
        //                     logout();
        //                     window.location.reload();
        //                 }}>Logout</button>
        //             </li>
        //         </ul>
        //     </div>
        // </nav>
        <nav className={`navbar ${darkTheme ? 'dark-theme' : 'light-theme'} ${isOpen ? 'active' : ''}`}>
            <div className="container">
                <Link to="/" className="logo">
                    <img className='logo-img' src={TextLogo} alt="logo" />
                </Link>
                <div className={`menu-toggle ${isOpen ? 'active' : ''}`} onClick={handleToggle}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    <li className="nav-item">
                        <Link to="/" onClick={handleToggle}>Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" onClick={handleToggle}>About</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/services" onClick={handleToggle}>Services</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" onClick={handleToggle}>Contact</Link>
                    </li>
                    <li className="nav-item">
                        <button className={`logout-button-nav ${darkTheme ? 'dark-theme' : 'light-theme'}`} onClick={() => {
                            logout();
                            window.location.reload();
                        }}>Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
