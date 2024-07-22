function BookItem({ item, onDelete, onClick }) {
  const { discount, price } = item;
  const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
  return (
    <div className="item" onClick={() => onClick(item)}>
      <img src={item.imageLink} alt={item.title} className="item-image" />
      <h3>{item.title}</h3>
      <div className="bookinfo">
        <p>{item.page} page</p>
      </div>
      <div style={{minHeight:"53px"}}>
      {discount > 0 && (
        <div className="item-discount">
          <p id="discount-price">{price}$</p>
          <p>{discount}%</p>
        </div>
      )}
      </div>
      <p>{item.author}</p>
      <p id="price">{finalPrice.toFixed(2)}$</p>

      <div className="delete-button">
        <button onClick={(e) => onDelete(e, item._id)}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default BookItem;
