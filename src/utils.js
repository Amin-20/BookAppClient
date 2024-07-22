import axios from "axios";

export async function getBooks( setBooks, setLoading, setError, page, setLoading2, setIsLastPage) {
  setLoading2(true);
  try {
    let query = 'http://localhost:27001/api/books';
    const response = await axios.get(query);
    const { data, totalPages, currentPage } = response.data;
    if (currentPage >= totalPages) {
      setIsLastPage(true);
    } else {
      setIsLastPage(false);
    }

    setBooks(prevBooks => (page === 1 ? data.books : [...prevBooks, ...data.books]));
  } catch (error) {
    console.error('Error fetching books:', error);
    setError('Error fetching books');
  } finally {
    setLoading2(false);
    setLoading(false)
  }
}

export async function handleDelete(id) {
  try {
    const token = localStorage.getItem('token');
    console.log(token)
    await axios.delete(`http://localhost:27001/api/books/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }
    );
  } catch (error) {
    console.error("Error deleting data: ", error);
    throw error;
  }
}

export async function handleFormSubmit(formData, selectedBook) {
  try {
    const token = localStorage.getItem('token');
    if (selectedBook) {
      await axios.patch(
        `http://localhost:27001/api/books/${selectedBook._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        }
      );
    } else {
      await axios.post("http://localhost:27001/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  } catch (error) {
    console.error("Error submitting form: ", error);
    throw error;
  }
}

