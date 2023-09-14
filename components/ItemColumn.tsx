const ItemColumn = ({children, onDrop, onDragOver}) => {
    return (
        <div
            className="w-full h-full border-dashed border-2 border-gray-400"
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            {children}
        </div>
    );
}

export default ItemColumn