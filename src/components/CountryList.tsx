// src/components/CountryList.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COUNTRIES } from '../queries/countriesQuery';
import './CountryList.css';

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
    const [filter, setFilter] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
    const [usedColorIndexes, setUsedColorIndexes] = useState<number[]>([]);
    const [groupBy, setGroupBy] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInput(inputValue);
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            const inputLower = input.toLowerCase();
            if (inputLower.startsWith('search:')) {
                // Extract the groupBy value from the input
                const groupByValue = inputLower.split('group:')[1];
                setGroupBy(groupByValue);
                // Remove the groupBy part from the filter
                setFilter(inputLower.split('group:')[0]);
            } else {
                setGroupBy(null);
                setFilter(inputLower);
            }
        }, 500); // Adjust the delay as needed (e.g., 500 milliseconds)

        return () => {
            clearTimeout(delay);
        };
    }, [input]);

    const handleCountryClick = (code: string) => {
        // Toggle selection state for the clicked country
        if (selectedCountry === code) {
            setSelectedCountry(null);
            setSelectedColorIndex(null);
        } else {
            setSelectedCountry(code);

            // Find the first available color index that is not already in use
            const unusedIndex = findUnusedColorIndex(usedColorIndexes);

            setSelectedColorIndex(unusedIndex);

            // Update the list of used color indexes
            setUsedColorIndexes([...usedColorIndexes, unusedIndex]);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Apply filtering based on the 'searchTerm' and 'groupBy'
    const filteredCountries = data.countries.filter((country: any) => {
        const lowerCaseName = (country.name || '').toLowerCase();
        const lowerCaseCode = (country.code || '').toLowerCase();
        const lowerCaseNative = (country.native || '').toLowerCase();
        const lowerCaseCapital = (country.capital || '').toLowerCase();
        const lowerCaseEmoji = (country.emoji || '').toLowerCase();
        const lowerCaseCurrency = (country.currency || '').toLowerCase();

        const filterLower = filter.trim();

        if (filterLower && filterLower.startsWith('search:')) {
            const groupByLower = groupBy ? groupBy.trim() : '';
            if (groupByLower) {
                return (
                    lowerCaseCurrency.includes(groupByLower) &&
                    (lowerCaseName.includes(filterLower) ||
                        lowerCaseCode.includes(filterLower) ||
                        lowerCaseNative.includes(filterLower) ||
                        lowerCaseCapital.includes(filterLower) ||
                        lowerCaseEmoji.includes(filterLower) ||
                        lowerCaseCurrency.includes(filterLower))
                );
            }
        } else {
            return (
                lowerCaseName.includes(filterLower) ||
                lowerCaseCode.includes(filterLower) ||
                lowerCaseNative.includes(filterLower) ||
                lowerCaseCapital.includes(filterLower) ||
                lowerCaseEmoji.includes(filterLower) ||
                lowerCaseCurrency.includes(filterLower)
            );
        }

        return false;
    });

    return (
        <div className='main'>
            <input
                className='input'
                type="text"
                placeholder="Filter by name, code, native, capital, emoji, or currency"
                value={input}
                onChange={handleInputChange}
            />
            <div className='container'>
                <ul className='list'>
                    {filteredCountries.map((country: any) => {
                        return (
                            <li
                                key={country.code}
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
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default CountryList;