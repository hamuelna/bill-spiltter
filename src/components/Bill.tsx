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
    const inputClassName = "border border-black rounded text-black"
    const tableHeaderClassName = "text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300"
    const tableClassName = "text-left py-3 px-4"
    const [price, setPrice] = useState(0)
    const [name, setName] = useState("")
    const [charge, setCharge] = useState(0)
    // set default tax to 7
    const [tax, setTax] = useState(7)

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

    const handleSetTable = (isForce: boolean) => () => {
        if (isForce || (price > 0 && name.length > 0)) {
            setTable((table) => {
                // add tax and surcharge to the end base on the current total
                // first calculate the charge from every total
                // then add the task
                const pureTaxName = 'Tax'
                const pureChargeName = 'Charge'
                const getPureName = (name: string) => name.split(" ")[0] ?? ''
                const taxName = `${pureTaxName} (${tax}%)`
                const chargeName = `${pureChargeName} (${charge}%)`
                const purePriceTable = table.filter(({ name: rowName }) => ![pureTaxName, pureChargeName].includes(getPureName(rowName)))
                const totalChargePrice = purePriceTable.reduce((prev, { price }) => prev + price, 0) * (charge / 100)
                const totalTaxPrice = (purePriceTable.reduce((prev, { price }) => prev + price, 0) + totalChargePrice) * (tax / 100)
                const chargeRow = {
                    name: chargeName, price: totalChargePrice, payer: table.find(({ name }) => getPureName(name) === pureChargeName)?.payer ?? []
                }
                const taxRow = {
                    name: taxName, price: totalTaxPrice, payer: table.find(({ name }) => getPureName(name) === pureTaxName)?.payer ?? []
                }
                if (isForce) {
                    return [...purePriceTable,chargeRow,taxRow]

                } else {
                    return [...purePriceTable,
                    {
                        name, price, payer: []
                    },chargeRow, taxRow
                    ]
                }
                
            })
            setPrice(0)
            setName('')
            
        }
        
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
            handleSetTable(false)
        }
    }

    return (
        <div className="grid grid-flow-row auto-rows-max gap-2">
            <h2>Enter billed item</h2>
            <p> Enter name and price and press enter or click the green button, click on minus button to remove</p>
            <div className="flex gap-2">
                <p>Charge: </p> 
                <input
                    type="number"
                    name="charge"
                    value={charge}
                    id="charge"
                    className={inputClassName}
                    onChange={(v) => setCharge(parseInt(v.currentTarget.value))}

                />
                <p>Tax: </p>
                <input
                    type="number"
                    name="tax"
                    value={tax}
                    id="tax"
                    className={inputClassName}
                    onChange={(v) => setTax(parseInt(v.currentTarget.value))}

                /> 
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" onClick={handleSetTable(true)}>Update Tax and Charge</button>
            </div>
            
            <table className="min-w-full bg-gray-800">
                <thead className="border-b border-gray-600">
                    <th className={tableHeaderClassName}>Name</th>
                    <th className={tableHeaderClassName}>Price</th>
                    <th className={tableHeaderClassName}>Payer</th>
                    <th className={tableHeaderClassName}>Remove</th>
                </thead>
                <tbody className="text-gray-400">
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
                                <button onClick={handleSetTable(false)} className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow">✓</button>
                            </div>
                        </td>
                        <td></td>
                    </tr>
                    {table.map( ({name, price, payer}, idx) => (
                        <tr className="hover:bg-gray-700" key={idx}>
                            <td className={tableClassName} key={`name-${idx}`}>{name}</td>
                            <td className={tableClassName} key={`price-${idx}`}>{price.toFixed(2)}</td>
                            <td className={tableClassName} key={`payer-${idx}`}>
                                <div className="grid grid-row-2 gap-2">
                                    <AddName names={names.filter((name) => !payer.includes(name.id))} onSelect={handleAddPayer(idx)} onSelectAll={handleAddAll(idx)} />
                                    <NameChip names={names.filter((name) => payer.includes(name.id))} isConfirm={false} onClick={handleRemovePayer(idx)} totalNames={names.length} onRemoveAll={handleRemoveAll(idx)} />
                                </div>
                            </td>
                            <td className={tableClassName}><button onClick={handleRemove(idx)} className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow"> - </button></td>
                        </tr>
                        
                    ) ) }
                </tbody>
            </table>
        </div>
    )
    
}