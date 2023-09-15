import Link from "next/link";
import React from "react";

const itemTileModal = (props) => {


    return (
        <div
            className="modal-menu w-52 bg-white shadow-md rounded-md absolute top-100 mt-2 left-50 translate-x-50 flex text-center justify-center flex-col items-center"
        >
            {/*{ props.orderCategoryColor !== null ? (*/}
            {/*    <Link className={''} href={`/orderToTool`}>*/}
            {/*        Do magazynu/!*<Image src={trash} alt={'info'}></Image>*!/*/}
            {/*    </Link>*/}
            {/*) : null }*/}

            <Link className={''} href={`/api/delete/${props.itemId}`}>
                Usuń{/*<Image src={trash} alt={'info'}></Image>*/}
            </Link>

        </div>
    );
}

export default itemTileModal