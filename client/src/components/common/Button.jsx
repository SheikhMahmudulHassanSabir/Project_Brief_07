function Button({ label = 'Click Me', onClick, type = 'button' }) {
    return (
        <button type={type} className="btn" onClick={onClick}>
            {label}
        </button>
    );
}

export default Button;
