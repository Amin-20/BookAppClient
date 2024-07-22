import { useEffect, useState, useRef } from "react";

function BookForm({ onSubmit, selectedBook, setSelectedBook }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    discount: "",
    page: "",
    publishDate: formatDate(new Date()),
    imageLink: "",
    file: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedBook) {
      setFormData({
        title: selectedBook.title || "",
        author: selectedBook.author || "",
        price: selectedBook.price || 0,
        discount: selectedBook.discount || 0,
        page: selectedBook.page || 0,
        publishDate:formatDate(new Date(selectedBook.publishDate)) || formatDate(new Date()),
        imageLink: selectedBook.imageLink || "",
        file: selectedBook.imageLink || null,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        price: 0,
        discount: 0,
        page: 0,
        publishDate: formatDate(new Date()),
        imageLink: "",
        file: null,
      });
    }
  }, [selectedBook]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "imageLink") {
      if (value === "") {
        setFormData({
          ...formData,
          file: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      } else {
        setFormData({
          ...formData,
          file: value,
        });
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = document.getElementById("form");
    const formDataObj = new FormData(form);
    try {
      await onSubmit(formDataObj, selectedBook);
      reset();
    } catch (error) {
      console.error("Error handling form submit: ", error.message);
    }
  };

  function reset() {
    setSelectedBook(null);
    setFormData({
      title: "",
      author: "",
      price: 0,
      discount: 0,
      page: 0,
      publishDate: formatDate(new Date()),
      imageLink: "",
      file: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }

  return (
    <div className="form-first">
      <form
        id="form"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="book-form"
      >
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Discount</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Page</label>
          <input
            type="number"
            name="page"
            value={formData.page}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Publish Date</label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image Link</label>
          <input
            type="text"
            name="imageLink"
            value={formData.imageLink}
            onChange={handleChange}
          />
        </div>
        {formData.imageLink && (
          <div className="current-image">
            <img
              src={formData.imageLink}
              onChange={handleChange}
              alt={"Selecteed book"}
            />
          </div>
        )}
        <button style={{ marginBottom: "12px" }} type="submit">
          {selectedBook ? "Update Book" : "Add Book"}
        </button>
        {selectedBook && (
          <button style={{ marginBottom: "12px" }} onClick={reset} type="reset">
            Clear
          </button>
        )}
      </form>
    </div>
  );
}


function formatDate(date) {
  const d = new Date(date);
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const day = `0${d.getDate()}`.slice(-2);
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}


export default BookForm;
