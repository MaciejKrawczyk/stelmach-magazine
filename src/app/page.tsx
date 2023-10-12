'use client'

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import pin from '../../public/place-marker-svgrepo-com 1.svg';
import settings from '../../public/Setting_alt_line.svg';
import { Places } from "@/src/objects/Places";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import ItemTile from "@/src/components/ItemTile";
import {useItems} from "@/src/hooks/useItems";

export default function Home() {

    const [expandedPlace, setExpandedPlace] = useState<number | null>(null);

    const { items, loading, error } = useItems()

    const itemCount = items ? items.reduce((acc, item) => {
        acc[item.placeId] = (acc[item.placeId] || 0) + 1;
        return acc;
    }, {}) : {};

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Image priority alt={'loading...'} src={loadingSVG} />
            </div>
        );
    }

    if (error) return <div>Error loading data</div>;
  
  return (
      <div className='flex justify-center'>
        <main className='w-10/12 h-auto mb-28'>
          <h1 className='font-semibold text-3xl my-10 mx-auto'>Przegląd</h1>
          {Places.map((place, index) => (
              <div key={index}>
                <div className="flex items-center my-5 p-2 cursor-pointer rounded-xl transition-colors duration-200 hover:bg-gray-200" onClick={() => setExpandedPlace(prevPlace => prevPlace === place.id ? null : place.id)}>
                  <div className="flex items-center mr-2">
                    <Image className="" priority src={pin} alt="pin" />
                    <div className="mx-4">
                      <span className='text-gray-900'>{place.name}</span>
                      <span className='mx-1 text-gray-400 text-sm'>({itemCount[place.id] || 0})</span>
                    </div>
                  </div>
                  <hr className="flex-grow border-t-2" />
                  <Image className="ml-4" priority src={settings} alt="settings" />
                </div>
                {expandedPlace === place.id && (
                    <section className='flex gap-5 flex-wrap'>
                      {place.id === 1 && (
                          <div className='w-64 h-96 bg-gray-100 flex flex-col justify-center items-center border-gray-200 rounded-xl shadow-item'>
                            <Link href={'/create/item'} className="relative cursor-pointer mb-4 w-1/2 aspect-square rounded-full bg-amber-100 flex items-center justify-center transition duration-200 hover:bg-amber-200">
                              <div className="absolute top-50% left-50% transform -translate-x-50% w-1 h-10 bg-amber-400 rounded-xl"></div>
                              <div className="absolute top-50% left-50% transform -translate-x-50% -translate-y-50% w-10 h-1 bg-amber-400 rounded-xl"></div>
                            </Link>
                            <div className='flex justify-center items-center flex-col'>
                              <h3 className='text-xl font-bold mb-2'>Dodaj przedmiot</h3>
                              <p className='text-lg font-light text-gray-500 text-center'>Dodaj nowy przedmiot do bazy danych</p>
                            </div>
                          </div>
                      )}
                      {items.filter(item => item.placeId === place.id).map((item, idx) => {
                        const orderCategoryColor = item.orderCategory !== null ? item.orderCategory.color : null

                        return (
                        <ItemTile
                            key={idx}
                            placeId={place.id}
                            itemId={item.id}
                            itemType={item.itemType.name}
                            name={item.name}
                            company={item.company.name}
                            date={item.status[0].createdAt}
                            shelfSize={item.shelfSize}
                            shelfId={item.shelf ? item.shelf.name : null}
                            orderCategoryColor={orderCategoryColor}
                        />
                        )})}
                    </section>
                )}
              </div>
          ))}
        </main>
      </div>
  );
}
