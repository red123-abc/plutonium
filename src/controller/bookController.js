const bookModel =require('../Models/bookModel.js');


// ======================= PUT /books/:bookId  ===========================

const updateBook = async function (req ,res){
          let bookId = req.params.bookId;

          let book = await bookModel.findById(bookId)
          if(! book || book.isDeleted ==true){
                    return res.status(404).send({status: false , message: "Book not found"})
          }
          if(req.token.bookId !== book.userId)

          let { title,excerpt,release date ,ISBN } =req.body

          if(title){
                    return res.status(200).send({status: true})
          }
