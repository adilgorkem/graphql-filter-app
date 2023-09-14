
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COUNTRIES } from '../queries/countriesQuery';
import './CountryList.css';

interface Country {
    code: string;
    name: string;
    native: string;
    capital: string;
    emoji: string;
    currency: string;
    languages: {
        code: string;
        name: string;
    }[];
}

const predefinedColors = ['#CCCCCC', '#93CDE1', '#ECE99A', '#CFF5A1', '#3D3D3D'];

const findUnusedColorIndex = (usedIndexes: number[]) => {
    for (let i = 0; i < predefinedColors.length; i++) {
        if (!usedIndexes.includes(i)) {
            return i;
        }
    }
    return usedIndexes.length % predefinedColors.length; // Cycle through colors when all are used
};

const CountryList: React.FC = () => {
    const { loading, error, data } = useQuery(GET_COUNTRIES);
    const [input, setInput] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
    const [usedColorIndexes, setUsedColorIndexes] = useState<number[]>([]);
    const [groupingOption, setGroupingOption] = useState<string>('currency');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInput(inputValue);
        setSelectedCountry(null);
    };

    const handleCountryClick = (code: string) => {
        // Toggle selection
        if (selectedCountry === code) {
            setSelectedCountry(null);
            setSelectedColorIndex(null);
        } else {
            selectCountry(code);
        }
    };

    const selectCountry = (code: string) => {
        setSelectedCountry(code);
        // Find the first available color index that is not already in use
        const unusedIndex = findUnusedColorIndex(usedColorIndexes);
        setSelectedColorIndex(unusedIndex);
        // Updates the list of used color indexes
        setUsedColorIndexes([...usedColorIndexes, unusedIndex]);
    }

    const handleGroupingInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGroupingOption(event.target.value);
    };

    // Filter countries based on search input
    const filteredCountries = data && data.countries && data.countries.filter((country:any) => country.name.toLowerCase().includes(input.toLowerCase()));
    

    // Group the filtered countries by the selected grouping option
    const groupedCountries: { [key: string]: Country[] } = {};

    filteredCountries && filteredCountries.forEach((country:any) => {
        let key = country[groupingOption];
        if (groupingOption === 'languages') {
            // If grouping by languages, create a comma-separated string of language names as the key
            key = country.languages.map((lang: any) => lang.name).join(', ');
          }
        if (!groupedCountries[key]) {
            groupedCountries[key] = [];
        }
        groupedCountries[key].push(country);
    });

    //Select and 10th or last country
    useEffect(() => {
        if(!selectedCountry && input.length) {
            const listElements = document.querySelectorAll('li');
            let length = listElements.length;
            let selectedIndex = 0;
            if(length > 9) {
                selectedIndex = 9;
            } else {
                selectedIndex = length - 1;
            }
            const countryCode = listElements[selectedIndex] && listElements[selectedIndex].getAttribute("data-country-code");
            if(countryCode) {
                selectCountry(countryCode);
            }
        }
        
    }, [input])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className='main'>
            <div className='head'>
            <input
                className='input'
                type="text"
                placeholder="Filter by name, code, native, capital, emoji, or currency"
                value={input}
                onChange={handleInputChange}
            />
            <select className='select' value={groupingOption} onChange={handleGroupingInputChange}>
                <option value="currency">Currency</option>
                <option value="languages">Languages</option>
            </select>
            </div>
            <div className='container'>
                <ul className='list'>
                    {Object.keys(groupedCountries).map((group, index) => (
                    <div key={index}>
                        <h3>{group}</h3>
                        {groupedCountries[group].map((country) => (
                            <li key={country.code}
                            data-country-code={country.code}
                            style={{
                                backgroundColor:
                                    selectedCountry === country.code
                                        ? predefinedColors[selectedColorIndex !== null ? selectedColorIndex : 0]
                                        : '',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleCountryClick(country.code)}
                            >
                                {country.name}, {country.code}, {country.native}, {country.capital}, {country.emoji}, {country.currency}
                            </li>
                        ))}
                    </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CountryList;