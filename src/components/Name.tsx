import { useState, type Dispatch, type SetStateAction, type MouseEventHandler } from "react"


export interface ColoredNameProps {
    id: number
    name: string
    color: string
}

export interface NameProps {
    isConfirm: boolean
    names: Array<ColoredNameProps>
    setNames: Dispatch<SetStateAction<Array<ColoredNameProps>>>
}

export interface NameChipProps {
    names: ColoredNameProps[]
    isConfirm: boolean
    onClick?: (rowIdx: number) => MouseEventHandler<HTMLButtonElement>
    onRemoveAll?: MouseEventHandler<HTMLButtonElement>
    totalNames?: number
}

export function NameChip({names, isConfirm, onClick, totalNames, onRemoveAll}: NameChipProps) {
    if (names.length === totalNames) {
        return (
            <div className="grid grid-flow-col auto-cols-max gap-2 bg-red-300 w-20 rounded-full px-4 py-2 mr-4">
                ALL
                <button onClick={onRemoveAll} className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow"> - </button>
            </div>
        )
    }
    return (
        <ul className="flex gap-2">
            {names.map(({ id, name, color }, idx) => (
                <li key={idx} className="rounded-full px-4 py-2 mr-4" style={{ backgroundColor: color}}>
                    <div className="grid grid-flow-col auto-cols-max gap-2">
                        {name}
                        {!isConfirm && <button onClick={onClick ? onClick(id): undefined} className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow"> - </button>}
                    </div>
                </li>
            ))}
        </ul>
    )

}

export default function Name({isConfirm, names, setNames}: NameProps) {

    const colorPool: string[] = [
        '#ef4444', // red-500
        '#22c55e', // green-500
        '#3b82f6', // blue-500
        '#eab308', // yellow-500
        '#a855f7', // purple-500
        '#ec4899', // pink-500
        '#6366f1', // indigo-500
        '#6b7280', // gray-500
        '#f97316', // orange-500
    ]
    
    const [colors, setColors] = useState<string[]>(colorPool)

    const generateRandomTailwindColor = () => {
        const color = colors[Math.floor(Math.random() * colors.length)]
        // remove the color from the pool
        setColors(colors.filter(c => color != c))
        return color ?? '#ef4444'
    }

    const handleSetName = (name: ColoredNameProps) => {
        setNames(prevState => [...prevState, name])
    }

    const [seqno, setSeqno] = useState(0)

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && event.currentTarget.value.length > 0) {
            event.preventDefault()
            handleSetName({id: seqno, name: event.currentTarget.value, color: generateRandomTailwindColor()})
            setSeqno(seqno + 1)
            event.currentTarget.value = ''
        }
    }

    const handleRemove = (buttonIdx: number) => () => {
        setNames(names.filter((name, idx) => buttonIdx != idx))
    }

    return (
        <div className="grid grid-flow-row auto-rows-max gap-2">
            <h2>Enter the name people of the people you want to split bill with</h2>
            {!isConfirm && <input
                type="text"
                name="name"
                id="name"
                className="w-[200px] h-[30px] border border-black rounded ..."
                onKeyDown={handleKeyPress}
            />}
            <NameChip {...{names, isConfirm, onClick: handleRemove }}/>
        </div>
        
    )
}