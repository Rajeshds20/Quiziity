import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/NavBar.css';
import TextLogo from '../assets/images/TextLogo.png';

const LogoutNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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
        <nav className={`navbar ${isOpen ? 'active' : ''}`}>
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
                        <Link to="/about" onClick={handleToggle}>About</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" onClick={handleToggle}>Contact</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" onClick={handleToggle}>Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/register" onClick={handleToggle}>Register</Link>
                    </li>
                    {/* My Profile Icon, with dropout logout and My profile page nav */}

                </ul>
            </div>
        </nav>
    );
};

export default LogoutNav;
