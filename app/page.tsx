'use client'

import React, {useEffect, useState} from "react";
import pin from '../public/place-marker-svgrepo-com 1.svg'
import settings from '../public/Setting_alt_line.svg'
import Image from "next/image";
import info from '../public/Info_alt_light.svg'
import scan from '../public/Scan_alt_2.svg'
import user from '../public/Company.svg'
import date from '../public/date.svg'
import boxClosed from '../public/Box_alt.svg'
import boxOpen from '../public/Box_open.svg'
import meatballs from '../public/Meatballs_menu.svg'
import edit from '../public/Edit_light.svg'
import change from '../public/Horizontal_down_right_main_light.svg'
import trash from '../public/Trash_light.svg'

import Link from "next/link";
import axios from "axios";
import {Places} from "@/objects/Places";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";

export default function Home() {

  const [itemCount, setItemCount] = useState({})

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const url = '/api/item';
      try {
        const response = await axios.get(url);
        if (isMounted) {
          setData(response.data);
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to fetch data:', e);
        if (isMounted) {
          setError(e);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <Image priority alt={'loading...'} src={loadingSVG} />
    </div>
  }

  if (error) {
    return <div>Error loading data</div>;
  }


  return (


    <div className={'flex justify-center'}>

      <main className={'w-10/12 h-auto mb-28'}>

        <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przegląd</h1>


        {Places.map((place, index) => {

          return (
              <>

              <div className="flex items-center my-5 ">
                <div className="flex items-center mr-2">
                  <Image className="" priority src={pin} alt="pin" />
                  <div className="mx-4">
                    <span className={'text-gray-900'}>{place.name}</span>
                    <span className={'mx-1 text-gray-400 text-sm'}>(10)</span>
                  </div>
                </div>
                <hr className="flex-grow border-t-2" />
                <Image className="ml-4" priority src={settings} alt="pin" />
              </div>

              <section className={'flex gap-5 flex-wrap'}>

                {place.id === 1 ? <div className={'w-64 h-96 bg-gray-100 flex flex-col justify-center items-center border-gray-200 rounded-xl shadow-item'}>
                  <Link href={'/create/item'} className="relative cursor-pointer mb-4 w-1/2 aspect-square rounded-full bg-amber-100 flex items-center justify-center transition duration-200 hover:bg-amber-200">
                    <div className="absolute top-50% left-50% transform -translate-x-50% w-1 h-10 bg-amber-400 rounded-xl"></div>
                    <div className="absolute top-50% left-50% transform -translate-x-50% -translate-y-50% w-10 h-1 bg-amber-400 rounded-xl"></div>
                  </Link>
                  <div className={'flex justify-center items-center flex-col'}>
                    <h3 className={'text-xl font-bold mb-2'}>Dodaj przedmiot</h3>
                    <p className={'text-lg font-light text-gray-500 text-center'}>Dodaj nowy przedmiot do bazy danych</p>
                  </div>
                </div> : <></>}


              {data.map((item, index) => {

                return (<>
                    {item.placeId === place.id ? <div className={'p-5 w-64 h-96 bg-gray-100 flex flex-col border-gray-200 rounded-xl shadow-item'}>
                      <div className={'flex justify-between w-full'}>
                        <div className={'bg-blue-500 py-1 px-5 text-white rounded-full'}>
                          {item.itemType.name}
                        </div>
                        <Image src={info} alt={'info'}></Image>
                      </div>
                      <hr className={'my-2'}/>
                      <div className={'flex flex-col gap-3 justify-start w-full'}>
                        <div className={'flex'}>
                          <Image className={'mr-3'} src={scan} alt={'info'}></Image>
                          <span className={'text-gray-400'}>{item.name}</span>
                        </div>
                        <hr className={'my-1'}/>
                        <div className={'flex'}>
                          <Image className={'mr-3'}  src={user} alt={'info'}></Image>
                          <span className={'text-gray-400'}>{item.company.name}</span>
                        </div>
                        <hr className={'my-1'}/>
                        <div className={'flex'}>
                          <Image className={'mr-3'}  src={date} alt={'info'}></Image>
                          <span className={'text-gray-400'}>17 paź 2022</span>
                        </div>
                        <hr className={'my-1'}/>
                        <div className={'flex'}>
                          <Image className={'mr-3'}  src={boxClosed} alt={'info'}></Image>
                          <span className={'text-gray-400'}>{item.shelfType}</span>
                        </div>
                        <div className={'flex'}>
                          <Image className={'mr-3'}  src={boxOpen} alt={'info'}></Image>
                          <span className={'text-gray-400'}>{item.shelfId}</span>
                        </div>
                      </div>
                      <div className={'flex justify-between my-4'}>
                        <Link className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'} href={''}>
                          <Image src={meatballs} alt={'info'}></Image>
                        </Link>
                        <Link className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'} href={''}>
                          <Image src={edit} alt={'info'}></Image>
                        </Link>
                        <Link className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'} href={''}>
                          <Image src={change} alt={'info'}></Image>
                        </Link>
                        <Link className={'p-2 aspect-square bg-red-600 rounded-full transform transition-transform duration-300 hover:scale-110'} href={''}>
                          <Image src={trash} alt={'info'}></Image>
                        </Link>
                      </div>


                    </div> : <></>}
                    </>
                )

              })}

            </section>
          </>

        )
        })}


        {/*<div className="flex items-center mb-5">*/}
        {/*  <div className="flex items-center mr-2">*/}
        {/*    <Image className="" priority src={pin} alt="pin" />*/}
        {/*    <div className="mx-4">*/}
        {/*      <span className={'text-gray-900'}>Magazyn</span>*/}
        {/*      <span className={'mx-1 text-gray-400 text-sm'}>(10)</span>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <hr className="flex-grow border-t-2" />*/}
        {/*  <Image className="ml-4" priority src={settings} alt="pin" />*/}
        {/*</div>*/}

        {/*<section className={'flex gap-5 flex-wrap'}>*/}

          {/*<div className={'w-64 h-96 bg-gray-100 flex flex-col justify-center items-center border-gray-200 rounded-xl shadow-item'}>*/}
          {/*  <Link href={'/create/item'} className="relative cursor-pointer mb-4 w-1/2 aspect-square rounded-full bg-amber-100 flex items-center justify-center transition duration-200 hover:bg-amber-200">*/}
          {/*    <div className="absolute top-50% left-50% transform -translate-x-50% w-1 h-10 bg-amber-400 rounded-xl"></div>*/}
          {/*    <div className="absolute top-50% left-50% transform -translate-x-50% -translate-y-50% w-10 h-1 bg-amber-400 rounded-xl"></div>*/}
          {/*  </Link>*/}
          {/*  <div className={'flex justify-center items-center flex-col'}>*/}
          {/*    <h3 className={'text-xl font-bold mb-2'}>Dodaj przedmiot</h3>*/}
          {/*    <p className={'text-lg font-light text-gray-500 text-center'}>Dodaj nowy przedmiot do bazy danych</p>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/* tutaj bedzie petla dla narzedzi magazynmowych */}

        {/*  {data.map((item, index) => {*/}

        {/*    return (*/}
        {/*        <div className={'p-5 w-64 h-96 bg-gray-100 flex flex-col border-gray-200 rounded-xl shadow-item'}>*/}
        {/*          <div className={'flex justify-between w-full'}>*/}
        {/*            <div className={'bg-blue-500 py-1 px-5 text-white rounded-full'}>*/}
        {/*              {item.company.name}*/}
        {/*            </div>*/}
        {/*            <Image src={info} alt={'info'}></Image>*/}
        {/*          </div>*/}
        {/*          <hr className={'my-2'}/>*/}
        {/*          <div className={'flex flex-col gap-3 justify-start w-full'}>*/}
        {/*            <div className={'flex'}>*/}
        {/*              <Image className={'mr-3'} src={scan} alt={'info'}></Image>*/}
        {/*              <span className={'text-gray-400'}>{item.name}</span>*/}
        {/*            </div>*/}
        {/*            <hr className={'my-1'}/>*/}
        {/*            <div className={'flex'}>*/}
        {/*              <Image className={'mr-3'}  src={user} alt={'info'}></Image>*/}
        {/*              <span className={'text-gray-400'}>{item.company.name}</span>*/}
        {/*            </div>*/}
        {/*            <hr className={'my-1'}/>*/}
        {/*            <div className={'flex'}>*/}
        {/*              <Image className={'mr-3'}  src={date} alt={'info'}></Image>*/}
        {/*              <span className={'text-gray-400'}>17 paź 2022</span>*/}
        {/*            </div>*/}
        {/*            <hr className={'my-1'}/>*/}
        {/*            <div className={'flex'}>*/}
        {/*              <Image className={'mr-3'}  src={boxClosed} alt={'info'}></Image>*/}
        {/*              <span className={'text-gray-400'}>{item.shelfType}</span>*/}
        {/*            </div>*/}
        {/*            <div className={'flex'}>*/}
        {/*              <Image className={'mr-3'}  src={boxOpen} alt={'info'}></Image>*/}
        {/*              <span className={'text-gray-400'}>{item.shelfId}</span>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*          <div className={'flex justify-between my-4'}>*/}
        {/*            <Link className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'} href={''}>*/}
        {/*              <Image src={meatballs} alt={'info'}></Image>*/}
        {/*            </Link>*/}
        {/*            <Link className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'} href={''}>*/}
        {/*              <Image src={edit} alt={'info'}></Image>*/}
        {/*            </Link>*/}
        {/*            <Link className={'p-2 aspect-square bg-gray-300 rounded-full transform transition-transform duration-300 hover:scale-110'} href={''}>*/}
        {/*              <Image src={change} alt={'info'}></Image>*/}
        {/*            </Link>*/}
        {/*            <Link className={'p-2 aspect-square bg-red-600 rounded-full transform transition-transform duration-300 hover:scale-110'} href={''}>*/}
        {/*              <Image src={trash} alt={'info'}></Image>*/}
        {/*            </Link>*/}
        {/*          </div>*/}


        {/*        </div>*/}
        {/*    )*/}

        {/*  })}*/}




        {/*</section>*/}



      </main>

    </div>
  )
}
