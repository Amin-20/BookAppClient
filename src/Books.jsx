import { useEffect, useState, useRef } from "react";
import { getBooks, handleDelete, handleFormSubmit } from "./utils";
import BookForm from "./BookForm";
import BookItem from "./BookItem";
import InformationPage from "./Information";
import "./App.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [showInfoPage, setShowInfoPage] = useState(false);
  const [actionType, setActionType] = useState(null);

  const [page, setPage] = useState(1);
  const [loading2, setLoading2] = useState(false);
  const booksRef = useRef(null);
  const initialRender = useRef(true);
  const [isLastPage, setIsLastPage] = useState(false);


  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    getBooks(
      setBooks,
      setLoading,
      setError,
      page,
      setLoading2,
      setIsLastPage
    );
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (booksRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = booksRef.current;
        if (
          scrollTop + clientHeight >= scrollHeight - 10 &&
          !loading2 &&
          !isLastPage
        ) {
          setLoading2(true);
          setPage((prevPage) => (prevPage === 1 ? prevPage + 2 : prevPage + 1));
        }
      }
    };

    const booksDiv = booksRef.current;
    if (booksDiv) {
      booksDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (booksDiv) {
        booksDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading2, isLastPage]);
  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleDeleteBook = (id) => {
    console.log(`idfirst${id}`);
    setActionType("delete");
    setInfoMessage("Are you sure you want to delete this book?");
    setShowInfoPage(true);
    setSelectedBookId(id);
  };

  const confirmDelete = async () => {
    setShowInfoPage(false);
    try {
      await handleDelete(selectedBookId);
      setPage(1);
      setBooks([]);
      getBooks(
        setBooks,
        setLoading,
        setError,
        page,
        setLoading2,
        setIsLastPage
      );
      setInfoMessage("Book successfully deleted.");
      setActionType("success");
      setShowInfoPage(true);
    } catch (error) {
      console.error("Error deleting book: ", error);
      setInfoMessage(error.response.data.message);
      setActionType("error");
      setShowInfoPage(true);
    }
  };

  const confirm = () => {
    setInfoMessage(null);
    setActionType(null);
    setShowInfoPage(false);
  };

  const cancelDelete = () => {
    setShowInfoPage(false);
  };

  const handleFormSubmitWrapper = async (formData) => {
    try {
      await handleFormSubmit(formData, selectedBook);
      getBooks(
        setBooks,
        setLoading,
        setError,
        page,
        setLoading2,
        setIsLastPage
      );
      setInfoMessage(
        selectedBook ? "Book successfully updated." : "Book successfully added"
      );
      setPage(1);
      setBooks([]);
      setActionType("success");
      setShowInfoPage(true);
      setSelectedBook(null);
    } catch (error) {
      console.error("Error submitting form: ", error);
      setInfoMessage(error.response.data.message);
      setActionType("error");
      setShowInfoPage(true);
      throw error;
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className={`book-list ${showInfoPage ? "disable-background" : ""}`}>
        <div className="books-first">
          <img className="logo" src="https://static.insales-cdn.com/assets/1/2089/6424617/1720076749/logotype.jpg" alt="logo" />
          <div ref={booksRef} className="list">
            {books &&
              books.map((item) => (
                <BookItem
                  key={item._id}
                  item={item}
                  onDelete={(e, _id) => {
                    e.stopPropagation();
                    handleDeleteBook(_id);
                  }}
                  onClick={handleBookClick}
                />
              ))}
            <div style={{ width: "100%" }}>{loading2 && <p>Loading...</p>}</div>
          </div>
        </div>
        <BookForm
          onSubmit={handleFormSubmitWrapper}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
        />
      </div>
      {showInfoPage && (
        <InformationPage
          actionType={actionType}
          message={infoMessage}
          onConfirm={actionType === "delete" ? confirmDelete : confirm}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}

export default Books;
