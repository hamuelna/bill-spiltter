import { type TableProps } from "./Bill";
import { type ColoredNameProps } from "./Name";

export interface SummaryProps {
    names: ColoredNameProps[]
    table: TableProps[]
}


export default function Summary({names, table}: SummaryProps) {
    const tableClassName = "text-left px-4 py-2"
    const calcPayment = ( payerId: number,  {payer, price}: TableProps) => {
        const isDivide = payer.filter(pid => pid === payerId).length > 0
        return isDivide ? price / payer.length : 0 
    }
    const payment = names.map(({id,}) => ({
        id, toPay: table.reduce((acc,row) => (acc + calcPayment(id, row)), 0)
    }))
    return (
        <div className="grid grid-flow-row auto-rows-max gap-2">
            <h2>Summary</h2>
            <table className="w-[1024px]">
                <thead>
                    <th className={tableClassName}>Name</th>
                    <th className={tableClassName}>Need to pay</th>
                </thead>
                <tbody>
                    {names.map(({id, name, color}) => (
                        <tr key={id}>
                            <td style={{backgroundColor: color}} className={tableClassName} key={`name-${id}`}>{name}</td>
                            <td style={{ backgroundColor: color }} className={tableClassName} key={`payed-${id}`}>
                                {payment.find(({id:pid}) => id === pid)?.toPay.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}