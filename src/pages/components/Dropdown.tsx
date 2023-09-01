
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BiChevronDown } from "react-icons/bi";
import {signIn, signOut, useSession} from 'next-auth/react'
import Image from 'next/image';
import { useRouter } from 'next/router';
interface DropdownItemProps {
    path: string;
    label: string;
    white?:boolean;
  }
function DropdownItem({ path, label, white}: DropdownItemProps) {
return (
    <li className={`py-2 ${!white ? ' text-blue-500' : ' text-white'}`}>
    <Link href={path} className={`hover:border-b-4 ${!white ? ' hover:border-blue-500' : ' hover:border-white'}`}>{label}</Link>
    </li>
);
}

interface DropdownProps {
name: string;
options: DropdownItemProps[];
white?: boolean;
fix?: boolean;
}

function Dropdown({ name, options, white, fix }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [distanceFromLeft, setDistanceFromLeft] = useState(0)

  const handleMenuEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const distance = rect.left
    
    setDistanceFromLeft(distance);
    setIsOpen(true);
  };
  const handleMenuLeave = () =>{
    setIsOpen(false);
  }

  return (
    <div className="">
      <button
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuLeave}
        className={`py-8 focus:outline-none flex flex-row items-center ${
          white ? 'text-black' : 'text-white'
        }`}
      >
        {name}
        <BiChevronDown
          size={20}
          className={`${isOpen && 'rotate-180'}`}
        />
      </button>
      {isOpen && (
        <div
          className={`w-full absolute flex flex-col ${
            !white ? 'bg-white' : 'bg-blue-400'
          } left-0 py-4 shadow-xl`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={handleMenuLeave}
        >
          <div className="relative">
            
            <ul style={{ marginLeft: `${distanceFromLeft}px`}}>
              {options.map((option, index) => (
                <DropdownItem
                  key={index}
                  path={option.path}
                  label={option.label}
                  white={white}
                />
              ))}
              
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}


  const dropdowns: { name: string, options: DropdownItemProps[] }[] = [
    {
      name: 'About',
      options: [
        { label: 'Asosiasi Experiential Learning Indonesia', path: '/aeli' },
        { label: 'Experiential Learning', path: '/el' },
        { label: 'Dewan Pimpinan Pusat', path: '/dpp' },

      ],
    },
    
    
  ];

function Navbar(props:any){
  const [fix, setFix] = useState(false);
  const [white, setWhite] = useState(false);
  const {className} = props
  const {data}:any = useSession()
  function setWhited(){
    if(window.scrollY > 560){
      setWhite(true);
    }else{
      setWhite(false);
    }
  }
  function setFixed(){
   
      if(window.scrollY > 560){
        setFix(true);
      }else{
        setFix(false);
      }
  
    
   
  }
  useEffect(()=>{
    window.addEventListener('scroll', setFixed);
    window.addEventListener('scroll', setWhited);
  },[])
  const {push} = useRouter()
  function handleSignout(){
    signOut()
  }
    return(
      <div className=''>
        
        <div className={`fixed ${className} z-[9999] top-0 flex justify-between flex-row w-full text-black  px-10  items-center
        ${fix ? '' : 'bg-blue-400'}
        ${white ? 'bg-white shadow-sm' : 'shadow-sm '}`} >
            <Link href="/" className=' flex flex-row gap-[calc(1/4*50px)] items-center justify-center'>
                {!white ? <Image width={50} height={50} className='w-[50px] h-[50px]' src="/logo-aeli-putih.png" alt="" /> : <Image width={50} height={50} className='w-[50px] h-[50px]' src="/logo-aeli.png" alt="" />}
                <div>
                  <h1 className={`text-[calc(1/4*50px)] ${!white ? 'text-white' : 'text-black'}`}>Asosiasi<br/>Experiential Learning<br/> Indonesia</h1>

                </div>
            </Link>
            <div className={`flex flex-row gap-8 items-center ${!fix ? 'text-white' : 'text-black'}`}>
            {dropdowns.map((dropdown, index) => (
              <Dropdown key={index} name={dropdown.name} options={dropdown.options} white={white} fix={fix}/>
            ))}
              <Link href={'/activities'}>Activities</Link>
              <Link href={'/dpd'}>DPD</Link>
              <Link href={'/members'}>Members</Link>
              <Link href="/articles">Articles</Link>
              <Link href="/news">News</Link>
            </div>
            
            {/* <li><Link href="/signin" className={` py-2 px-3 ${!white ? 'text-black bg-white hover:bg-gray-100' : 'text-white bg-blue-500 hover:bg-blue-600'}`}>Sign In</Link></li> */}
            <div>
            {
              data ?
              <div className='flex flex-row gap-4 items-center'>
                <Link className={`${white ? 'text-black' : 'text-white'}`} href={`/profile/${data.user.name}`}>{data.user.name}</Link>
                <button className={` py-2 px-3 ${!white ? 'text-black bg-white hover:bg-gray-100' : 'text-white bg-blue-500 hover:bg-blue-600'}`} onClick={handleSignout}>Sign Out</button>
              </div>
              :
              <button className={` py-2 px-3 ${!white ? 'text-black bg-white hover:bg-gray-100' : 'text-white bg-blue-500 hover:bg-blue-600'}`} onClick={()=>signIn()}>Sign In</button>
            }
            </div>
        </div>
        
      </div>
        
        
    )
}
export default Navbar;
