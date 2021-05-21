import React from 'react';
import Konva from 'konva';

const filterDict = {
    '': [],
    // 'Blur': [Konva.Filters.Blur],
    // 'Brighten': [Konva.Filters.Brighten],
    // 'Contrast': [Konva.Filters.Contrast],
    'Emboss': [Konva.Filters.Emboss],
    // 'Enhance': [Konva.Filters.Enhance],
    'Grayscale': [Konva.Filters.Grayscale],
    // 'HSL': [Konva.Filters.HSL],
    // 'HSV': [Konva.Filters.HSV],
    'Invert': [Konva.Filters.Invert],
    'Kaleidoscope': [Konva.Filters.Kaleidoscope],
    // 'Mask': [Konva.Filters.Mask],
    'Noise': [Konva.Filters.Noise],
    'Pixelate': [Konva.Filters.Pixelate],
    // 'Posterize': [Konva.Filters.Posterize],
    // 'RGB': [Konva.Filters.RGB],
    // 'RGBA': [Konva.Filters.RGBA],
    'Sepia': [Konva.Filters.Sepia],
    'Solarize': [Konva.Filters.Solarize],
    // 'Threshold': [Konva.Filters.Threshold]
}

function FilterSelector({filter, setFilter}) {
    const filterKey = Object.keys(filter).find(key => {
        return filterDict[key] === filter;
    })

    return (
        <div>
            <select value={filterKey} onChange={e => setFilter(filterDict[e.target.value])}>
                <option value=''>None</option>
                {/* <option value='Blur'>Blur</option>
                <option value='Brighten'>Brighten</option>
                <option value='Contrast'>Contrast</option> */}
                <option value='Emboss'>Emboss</option>
                {/* <option value='Enhance'>Enhance</option> */}
                <option value='Grayscale'>Grayscale</option>
                {/* <option value='HSL'>HSL</option>
                <option value='HSV'>HSV</option> */}
                <option value='Invert'>Invert</option>
                <option value='Kaleidoscope'>Kaleidoscope</option>
                {/* <option value='Mask'>Mask</option> */}
                <option value='Noise'>Noise</option>
                <option value='Pixelate'>Pixelate</option>
                {/* <option value='Posterize'>Posterize</option> */}
                {/* <option value='RGB'>RGB</option>
                <option value='RGBA'>RGBA</option> */}
                <option value='Sepia'>Sepia</option>
                <option value='Solarize'>Solarize</option>
                {/* <option value='Threshold'>Threshold</option> */}
            </select>
        </div>
    );
}

export default FilterSelector;
