'use client'

import {useParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";
import loadingSVG from "@/public/Dual Ring-1.5s-191px.svg";
import {formatDate} from "@/utils/formatDate";

const page = () => {

    const params = useParams()
    const id = params.id

    const [item, setItem] = useState([])
    const [orderCategories, setOrderCategories] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/item/${id}`);
                console.log(response.data)
                if (isMounted) {
                    setItem(response.data);
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
        return () => { isMounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Image priority alt={'loading...'} src={loadingSVG} />
            </div>
        );
    }

    if (error) return <div>Error loading data</div>;



    return <div className={'flex justify-center'}>

        <main className={'w-9/12 h-auto mb-28'}>

            <h1 className={'font-semibold text-3xl my-10 mx-auto '}>Przedmiot {item.name}</h1>

            <div className={'grid grid-cols-2'}>

                {item.status.map((status, index) => {
                    return (
                        <div>
                            <div>{formatDate(status.createdAt)}</div>
                            <div>{status.name}</div>
                            <div>{status.description}</div>
                            <hr/>
                        </div>
                    )
                })}

            {/*<Timeline>*/}
            {/*    {item.status.map((status, index) => {*/}
            {/*        return (*/}
            {/*            <TimelineItem*/}
            {/*                key={index}*/}
            {/*                  sx={{*/}
            {/*                [`& .${timelineOppositeContentClasses.root}`]: {*/}
            {/*                    flex: 0.2,*/}
            {/*                },*/}
            {/*            }}*/}
            {/*            >*/}
            {/*                <TimelineOppositeContent*/}
            {/*                    sx={{ m: 'auto 0' }}*/}
            {/*                    align="right"*/}
            {/*                    variant="body2"*/}
            {/*                    color="text.secondary"*/}
            {/*                >*/}
            {/*                    {formatDate(status.createdAt)}*/}
            {/*                </TimelineOppositeContent>*/}
            {/*                <TimelineSeparator>*/}
            {/*                    <TimelineConnector />*/}
            {/*                    <TimelineDot>*/}
            {/*                        <CheckIcon />*/}
            {/*                    </TimelineDot>*/}
            {/*                    <TimelineConnector />*/}
            {/*                </TimelineSeparator>*/}
            {/*                <TimelineContent sx={{ py: '12px', px: 2 }}>*/}
            {/*                    <Typography variant="h6" component="span">*/}
            {/*                        {status.name}*/}
            {/*                    </Typography>*/}
            {/*                    <Typography>{status.description}</Typography>*/}
            {/*                </TimelineContent>*/}
            {/*            </TimelineItem>*/}
            {/*            )})}*/}
            {/*</Timeline>*/}

            <div className={'bg-red-600 w-full h-96 rounded-xl text-white flex justify-center flex-col items-center text-center'}>

                <div className={'my-2'}>
                    <p>Firma</p>
                    <p>{item.company.name}</p>
                </div>

                <div className={'my-2'}>
                    <p>Opis</p>
                    <p>{item.description}</p>
                </div>

                <div className={'my-2'}>
                    <p>Typ</p>
                    <p>{item.itemType.name}</p>
                </div>

                {item.attributeValue.map((attribute) => {
                    return (
                        <div className={'my-2'} key={attribute.id}>
                            <p>{attribute.typeattribute.name}</p>
                            <p>{attribute.value}</p>
                        </div>
                    )
                })}

            </div>
            </div>

        </main>

    </div>
}

export default page