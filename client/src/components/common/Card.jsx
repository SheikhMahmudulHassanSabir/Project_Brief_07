function Card({ title = 'Card Title', children }) {
    return (
        <div className="card">
            <h3 className="card-title">{title}</h3>
            <div className="card-body">
                {children || <p>Placeholder card content.</p>}
            </div>
        </div>
    );
}

export default Card;