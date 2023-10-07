import React, { Children, useLayoutEffect } from 'react';

function Bookmark(props) {
    const { className, children, ...restProps } = props;
    return (
        <li {...restProps} className="timeline-item">
            {children}
        </li>
    );
}

function Timeline(props) {
    const { className, tip = true, children } = props;
    const tipClassName = tip ? 'with-tip' : '';
    const fullClassName = `timeline-wrapper ${tipClassName} ${className || ''}`;
    const numBookmarks = Children.count(children);

    useLayoutEffect(() => {
        let css = '';
        for (let i = 1; i <= numBookmarks; i += 1) {
            css += `.timeline-item:nth-child(${i}) {grid-row: ${i};}`;
        }

        document.head.insertAdjacentHTML(
            'beforeend',
            `<style data-timeline-styles>${css}</style>`
        );

        return () => {
            document.querySelector('[data-timeline-styles]').remove();
        };
    }, [numBookmarks]);

    return (
        <div className={fullClassName}>
            <div className="timeline-connector" />
            <ul className="timeline">
                {children}
                {Array(numBookmarks)
                    .fill()
                    .map((_, i) => (
                        <span key={i} className="timeline-dotmark">
              <div className="timeline-dot" />
            </span>
                    ))}
            </ul>
        </div>
    );
}

export { Timeline, Bookmark };
