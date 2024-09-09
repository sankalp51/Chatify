/* eslint-disable react/prop-types */
export default function Button({ name, ...props }) {
    return (
        <button {...props}>{name}</button>
    )
}
