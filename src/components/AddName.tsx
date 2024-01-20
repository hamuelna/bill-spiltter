import React, { type MouseEventHandler, useState, useEffect, useRef } from 'react';
import { type ColoredNameProps } from './Name';

interface AddNameProps {
    onSelect: (rowIdx: number) => MouseEventHandler<HTMLAnchorElement>
    onSelectAll: MouseEventHandler<HTMLAnchorElement>
    names: ColoredNameProps[]
}

export default function AddName({onSelect, names, onSelectAll}: AddNameProps){
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

    const toggleDropdown = () => {
        if (names.length > 0) {
            setIsOpen(!isOpen)
        }
    };

    const itemClassName = "block px-4 py-2 text-gray-800 hover:bg-gray-100"


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && event.target instanceof Node) {
                if (!dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen])

    return (
        <div className="relative" ref={dropdownRef}>
            <button disabled={names.length === 0} onClick={toggleDropdown} className="px-4 py-2 bg-blue-500 text-white rounded">
                Add
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl" style={{ zIndex: 2 }}>
                    <a onClick={onSelectAll} className={itemClassName}> ALL </a>
                    {names.map(({id, name, color}, idx) =>  (
                        <a key={idx} href="#" onClick={onSelect ? onSelect(id) : undefined} className={itemClassName} style={{
                            backgroundColor: color
                        }}>{name}</a>
                    ))}
                </div>
            )}
        </div>
    );
};
