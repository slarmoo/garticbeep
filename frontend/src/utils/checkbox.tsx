import { useState } from 'react'

export function Checkbox(props: checkboxProps) {
    const [checked, setChecked] = useState<Boolean>(false);

    return <input type="checkbox" id={props.id} required className={props.classList.join(" ")} onClick={() => setChecked(!checked)} value={checked + ""} />;
}

interface checkboxProps {
    classList: string[],
    id: string,

}