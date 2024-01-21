import React, { type Dispatch } from "react"
import { useState } from "react"
import { NameChip, type ColoredNameProps } from "./Name"
import AddName from "./AddName"


export interface TableProps {
    name: string
    price: number
    payer: number[]
    
}

export interface BillProps {
    names: ColoredNameProps[]
    table: TableProps[]
    setTable: Dispatch<React.SetStateAction<TableProps[]>>
}

export default function Bill({ names, table, setTable }: BillProps) {
    const inputClassName = "border border-black rounded"
    const tableClassName = "text-left px-4 py-2"
    const [price, setPrice] = useState(0)
    const [name, setName] = useState("")

    const handleAddPayer = (tblIdx: number) => (payerIdx: number) => () => {
        const newTable = table.map((row, idx) => tblIdx === idx ? {...row, payer: [...row.payer, payerIdx]} : row)
        setTable(newTable)
    }

    const handleRemovePayer = (tblIdx: number) => (payerIdx: number) => () => {
        const newTable = table.map((row, idx) => tblIdx === idx ? { ...row, payer: row.payer.filter((id) => id !== payerIdx) } : row)
        console.log("remove payer", newTable, payerIdx)
        setTable(newTable)
    }

    const handleAddAll = (tblIdx: number) => () => {
        const newTable = table.map((row, idx) => tblIdx === idx ? { ...row, payer: names.map(({id}) => id) } : row)
        setTable(newTable)
    }

    const handleRemoveAll = (tblIdx: number) => () => {
        const newTable = table.map((row, idx) => tblIdx === idx ? { ...row, payer: [] } : row)
        setTable(newTable)
    }

    const handleSetTable = () => {
        if (price > 0 && name.length > 0) {
            setTable([...table, {
                name, price, payer: []
            }])
        }
        setPrice(0)
        setName('')
    }

    const handleSetPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value.length == 0) {
            setPrice(0)
        } else {
            setPrice(parseFloat(event.currentTarget.value))
        }
    }

    const handleRemove = (rowIdx: number) => () => {
        setTable(table.filter((name, idx) => rowIdx != idx))
    }

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter' || event.key == 'NumpadEnter') {
            handleSetTable()
        }
    }

    return (
        <div className="grid grid-flow-row auto-rows-max gap-2">
            <h2>Enter billed item</h2>
            <table className="w-[1024px]">
                <thead>
                    <th className={tableClassName}>Name</th>
                    <th className={tableClassName}>Price</th>
                    <th className={tableClassName}>Payer</th>
                    <th className={tableClassName}>Remove</th>
                </thead>
                <tbody>
                    <tr>
                        <td className={tableClassName}>
                            <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            className={inputClassName}
                            onChange={(v) => setName(v.currentTarget.value)}
                            onKeyDown={handleEnter}
                            />
                        </td>
                        <td className={tableClassName}>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    name="price"
                                    value={price}
                                    id="price"
                                    className={inputClassName}
                                    onChange={handleSetPrice}
                                    onKeyDown={handleEnter}
                                />
                                <button onClick={handleSetTable} className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow">✓</button>
                            </div>
                        </td>
                        <td></td>
                    </tr>
                    {table.map( ({name, price, payer}, idx) => (
                        <tr key={idx}>
                            <td className={tableClassName} key={`name-${idx}`}>{name}</td>
                            <td className={tableClassName} key={`price-${idx}`}>{price}</td>
                            <td className={tableClassName} key={`payer-${idx}`}>
                                <AddName names={names.filter((name) => !payer.includes(name.id))} onSelect={handleAddPayer(idx) } onSelectAll={handleAddAll(idx)}/>
                                <NameChip names={names.filter((name) => payer.includes(name.id))} isConfirm={false} onClick={handleRemovePayer(idx)} totalNames={names.length} onRemoveAll={handleRemoveAll(idx)}/>
                            </td>
                            <td className={tableClassName}><button onClick={handleRemove(idx)} className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow"> - </button></td>
                        </tr>
                        
                    ) ) }
                </tbody>
            </table>
        </div>
    )
    
}