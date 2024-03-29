import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/NavBar.css';
import TextLogo from '../assets/images/TextLogo.png';
import { useUser } from '../config/UseUser';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { logout, darkTheme } = useUser();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close the dropdown if the click is outside of it
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (isProfileOpen) {
                    setIsProfileOpen(false);
                }
            }
        };

        // Attach the event listener to the document when the component mounts
        document.addEventListener('click', handleClickOutside, { capture: true });

        // Detach the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isProfileOpen]); // Empty dependency array means this effect runs once after the initial render

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };


    const handleProfileToggle = () => {
        setIsProfileOpen(!isProfileOpen);
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
                        <Link to="/global" onClick={handleToggle}>Rankings</Link>
                    </li>
                    <li className="nav-item">
                        <a href="#about" onClick={handleToggle}>About</a>
                    </li>
                    <li className="nav-item">
                        <a href="#contact" onClick={handleToggle}>Contact</a>
                    </li>
                    {/* My Profile Icon, with dropout logout and My profile page nav */}
                    <li className="nav-item profile-menu">
                        <div className="profile-icon" style={{ cursor: 'pointer' }} onClick={handleProfileToggle}>
                            <svg width={35} height={35} style={{ marginTop: '-5px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                            </svg>
                        </div>
                        <div ref={dropdownRef} className={`dropdown-menu ${isProfileOpen ? 'active' : 'hidden'}`}>
                            <Link to="/myprofile" onClick={handleProfileToggle}>My Profile</Link>
                            <a onClick={() => {
                                logout();
                                handleProfileToggle();
                                window.location.reload();
                            }}>Logout</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
