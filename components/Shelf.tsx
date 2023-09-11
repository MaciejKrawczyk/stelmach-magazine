import React from "react";

export const Shelf = ({ filterCondition, gridClass }) => (
    <div className={`gap-3 border-gray-600 ${gridClass}`}>
        {
            shelves
                .filter(filterCondition)
                .map(shelf => (
                    <div
                        className="flex items-center justify-center"
                        key={shelf.id}
                        style={{ backgroundColor: shelf.category.color }}
                    >
                        {shelf.name}
                    </div>
                ))
        }
    </div>
);