import React from 'react';

function FontSelector({ fontFamily, changeFontFamily }) {
    return (
        <div>
            <select value={fontFamily} onChange={e => changeFontFamily(e)}>
                <option value="Arial">Arial</option>
                <option value="Girassol">Girassol</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Itim">Itim</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
            </select>
        </div>
    )
}

export default FontSelector;
