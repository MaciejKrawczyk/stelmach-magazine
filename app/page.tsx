'use client'

import React, {useEffect, useState} from "react";
import pin from '../public/place-marker-svgrepo-com 1.svg'
import settings from '../public/Setting_alt_line.svg'
import Image from "next/image";

import Link from "next/link";
import axios from "axios";
import {Places} from "@/objects/Places";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import ItemTile from "@/components/ItemTile";

export default function Home() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [expandedPlace, setExpandedPlace] = useState(null);

  const togglePlace = (placeId) => {
    setExpandedPlace(prevPlace => {
      if (prevPlace === placeId) return null;  // If the place is already expanded, collapse it
      return placeId;  // Otherwise, set the expanded place to the clicked place
    });
  };

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

  // Calculate the itemCount for each place
  const itemCount = data.reduce((acc, item) => {
    acc[item.placeId] = (acc[item.placeId] || 0) + 1;
    return acc;
  }, {});


  return (

    <div className={'flex justify-center'}>

      <main className={'w-10/12 h-auto mb-28'}>

        <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przegląd</h1>

        {Places.map((place, index) => {

          return (
              <div key={index}>

                <div className="flex items-center my-5 p-2 cursor-pointer rounded-xl transition-colors duration-200 hover:bg-gray-200" onClick={() => togglePlace(place.id)}>
                <div className="flex items-center mr-2">
                  <Image className="" priority src={pin} alt="pin" />
                  <div className="mx-4">
                    <span className={'text-gray-900'}>{place.name}</span>
                    <span className={'mx-1 text-gray-400 text-sm'}>({itemCount[place.id] || 0})</span>
                  </div>
                </div>
                <hr className="flex-grow border-t-2" />
                <Image className="ml-4" priority src={settings} alt="pin" />
              </div>

                {expandedPlace === place.id && (

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

                return (<div key={index}>
                    {item.placeId === place.id ?
                        <ItemTile
                            itemId={item.id}
                            itemType={item.itemType.name}
                            name={item.name}
                            company={item.company.name}
                            date={item.status[0].createdAt}
                            shelfType={item.shelfType}
                            shelfId={item.shelf.name}
                        /> : <></>}
                    </div>
                )

              })}

            </section>
                )}

          </div>

        )
        })}

      </main>

    </div>
  )
}
