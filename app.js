// Author: Mohammad Faisal
// Project: Book management portal
// Language: HTML,CSS,JAVASCRIPT, bootstrap
// Date: 12/09/2019

// Book Class: represent a BOOK
class Book
{
    constructor(title,author,isbn)
    {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: Handing with the User Interface
class UI
{
    static displayBooks()
    {
        // const StoredBooks = [
        //     {
        //         title: 'Engineering Maths',
        //         author: 'Ram Gopal',
        //         isbn: '5823243'
        //     },
        //     {
        //         title:'Physics with HC Verma',
        //         author:'HC Verma',
        //         isbn: '4972374'
        //     }
        // ];

        //const books = StoredBooks;
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book)
    {
        const list = document.querySelector('#book-list');

        // following is the standard method to declare the DOM 
        const row = document.createElement('tr');
         
        // let's make column here

        row.innerHTML =`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el)
    {
         if(el.classList.contains('delete')){
             el.parentElement.parentElement.remove();
         }
    }
    static clearFields()
    {
        document.querySelector('#title').value ='';
        document.querySelector('#author').value ='';
        document.querySelector('#isbn').value ='';
    

    }
    
}
// Store class:: Handle with the local storage of the browser
class Store{

    static getBooks()
    {
        let books;
        if(localStorage.getItem('books')===null)
        {
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
            // we uses JSON parse method to assign the books which is in string form into regular string array
        }
        return books;
    }

    static addBook(book)
    {
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    
    static removeBook(isbn)
    {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn)
            {
                books.splice(index,1); // remove the book
            }
        });
    
        localStorage.setItem('books',JSON.stringify(books)); 
    }
}

// Event: Display Books 
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit',(e)=>
{
    // prevent actual submit
    e.preventDefault();
  // Get form values
  
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // validation

  if(title==='' || author==='' || isbn==='')
  {
    Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Please fill all the Fields.',
        footer: '<h5 class="text-center"><i class="fas fa-book-open text-success"></i> Faisal<span class="text-success">Book</span>Diary</h5>'
      })
  }
  else
  {
    Swal.fire({
        position: 'top-end',
        type: 'success',
        title: 'Your Book has been saved',
        showConfirmButton: false,
        timer: 1500
      })
  // initatiate book
  const book = new Book(title,author,isbn);

//   console.log(book);

    // Add book to UI
    UI.addBookToList(book);


    // Add book to LocalStorage

    Store.addBook(book);
    
    // clear Fields
    UI.clearFields();
  }
});
 
// Event: Remove a book
document.querySelector('#book-list').addEventListener('click',(e)=>
{
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        // console.log(e.target);
        UI.deleteBook(e.target);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your Book  is safe :)',
            'error'
          )
        }
      }) 
});
