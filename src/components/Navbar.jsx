import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { styles } from '../styles';
import { navLinks } from '../constants';
import { logo, menu, close } from '../assets';

const Navbar = () => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);

  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}>
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to="/"
          className='flex items-center gap-2'
          onClick={() => {
            setActive('');
            window.scrollTo(0, 0);
          }}
        >
          {/* <img src={logo} alt="logo" className='w-14 h-14 object-contain' /> */}
          <p className="text-white text-[18px] font-bold cursor-pointer">Harrison Munden</p>
        </Link>
        <ul className="list-none hidden sm:flex flex-10 gap-10">
          {navLinks.map((Link) => (
            <li
              key={Link.id}
              className={active === Link.title ? "text-white hover:text-white" : "text-secondary hover:text-white"}
              onClick={() => setActive(Link.title)}
            >
              <a href={`#${Link.id}`}>{Link.title}</a>
            </li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img 
            src={toggle ? close : logo}
            alt="menu"
            className={`object-contain cursor-pointer ${toggle ? 'w-[20px] h-[20px]' : 'w-[60px] h-[60px]'}`}
            style={{ position: 'absolute', top: '55%', left: '90%', transform: 'translate(-50%, -50%)' }} // Center the image
            onClick={() => setToggle(!toggle)}
          />
          <div 
            className={`${toggle ? 'flex' : 'hidden'} p-3 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[110px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((Link) => (
                <li
                  key={Link.id}
                  className={active === Link.title ? "text-white hover:text-white" : "text-secondary hover:text-white"}
                  onClick={() => {
                    setToggle(false);
                    setActive(Link.title);
                  }}
                >
                  <a href={`#${Link.id}`}>{Link.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;