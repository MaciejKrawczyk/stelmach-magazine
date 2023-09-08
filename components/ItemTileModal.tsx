import Link from "next/link";
import React from "react";

const itemTileModal = (props) => {


    return (
        <div
            className="modal-menu w-52 bg-white shadow-md rounded-md absolute top-100 mt-2 left-50 translate-x-50 flex text-center justify-center flex-col items-center"
            onMouseLeave={props.onMouseLeave} // Close the modal on mouse leave
        >
            {/* Add your modal menu items here */}

            {/*<div className={'my-2 p-4'}>Option 1</div>*/}
            {/*<div className={'my-2 p-4'}>Option 1</div>*/}
            {/*<div className={'my-2 p-4'}>Option 1</div>*/}

            <Link className={'bg-red-600 text-white w-full p-4'} href={`/api/delete/${props.itemId}`}>
                Usuń{/*<Image src={trash} alt={'info'}></Image>*/}
            </Link>

        </div>
    );
}

export default itemTileModal