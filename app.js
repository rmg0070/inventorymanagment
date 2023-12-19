const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
// app.use(session({
//   secret : 'webslesson',
//   resave : true,
//   saveUninitialized : true
// }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.use(session({
  secret : 'webslesson',
  resave : true,
  saveUninitialized : true
}));


// MySQL database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'inventory',
  insecureAuth: true, 
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + db.threadId);
});

// Define a route to fetch data from MySQL

app.get('/', function(req, res, next) {
  res.render('login', { title: 'Express', session : req.session });
});
app.get('/dashboard', (req, res) => {
  let sql1 = 'SELECT SUM(amount) AS TotalAmount FROM orders';
  let sql3 = 'SELECT COUNT(pid) AS NumberOfProducts FROM product';
  let sql2 = 'SELECT COUNT(orderid) AS NumberOforders FROM orders';
  let sql4 = 'SELECT SUM(price) AS TotalItemsOrdered FROM product';
  let query1 = db.query(sql1,(err1,rows1,fields1)=>{
    if(!err1){
      tot_sales=rows1
    }

  });
  let query2 = db.query(sql2,(err2,rows2,fields2)=>{
    if(!err2){
      nof_ord=rows2
    }

  });
  let query4 = db.query(sql4,(err4,rows4,fields4)=>{
    if(!err4){
      stk_val=rows4
    }

  });

  let query3= db.query(sql3, (err3, rows3, fields3)=>{
    // res.render('index1.ejs', { products: [] }); 
    // Render the index.ejs page with an empty array initially
    if(!err3){
      ord_num = rows3
      console.log('Fetched total no. of orders from ordersdb')
      res.render('index1.ejs',{
        tot_sales:tot_sales,
        nof_ord:nof_ord,
        ord_num:rows3,
        stk_val:stk_val     
        });
    }
 
  });

})
app.post('/login', function(request, response, next){

  var user_email_address = request.body.user_email_address;

  var user_password = request.body.user_password;

  if(user_email_address && user_password)
  {
      query = `
      SELECT * FROM user_login 
      WHERE user_email = "${user_email_address}"
      `;

      db.query(query, function(error, data){

          if(data.length > 0)
          {
              for(var count = 0; count < data.length; count++)
              {
                console.log((data[count].user_password));
                  if(data[count].user_password == user_password)
                  {
                      request.session.user_id = data[count].user_id;

                      response.redirect("/dashboard");
                  }
                  else
                  {
                    response.redirect("/dashboard");
                  }
              }
          }
          else
          {
              response.send('Incorrect Email Address');
          }
          response.end();
      });
  }
  else
  {
      response.send('Please Enter Email Address and Password Details');
      response.end();
  }

});
app.get('/index', (req, res) => {
  
  res.render('index', { products: [] }); // Render the index.ejs page with an empty array initially
})

app.get('/product', (req, res) => {
  
  res.render('product', { products: [] }); // Render the index.ejs page with an empty array initially
})
  app.post('/addProduct', (req, res) => {
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const productId = req.body.productId;
    const productDescription = req.body.productDescription;
    const productQuantity = req.body.productQuantity;
    const categoryId = req.body.categoryId;
    const suppliersId = req.body.suppliersId;
    const query = 'INSERT INTO product (pid,pname,pdesc,price,quantity,categoryId,suppliersId) VALUES (?, ?,?,?,?,?,?)';
  
    db.query(query, [productId,productName,productDescription, productPrice,productQuantity,categoryId,suppliersId], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ' + err.stack);
        res.status(500).send('Error adding product');
        return;
      }
  
      // After adding the product, fetch the updated list of products
      const searchQuery = 'SELECT * FROM product';
      db.query(searchQuery, (err, products) => {
        if (err) {
          console.error('Error executing MySQL query: ' + err.stack);
          res.status(500).send('Error fetching products');
          return;
        }
  
        // Render the index page with the updated list of products
        res.render('index', { message: 'Product Management', products:[] });
      });
    });
  });
  


  app.post('/editProduct', (req, res) => {
    const productName = req.body.productName;
    const productPrice = req.body.productPrice;
    const productId = req.body.productId;
    const productDescription = req.body.productDescription;
    const productQuantity = req.body.productQuantity;
    const categoryId = req.body.categoryId;
    const suppliersId = req.body.suppliersId;
    const query = 'update product set pname= ? ,pdesc= ?,price= ?,quantity=?,categoryId=?,suppliersId=? where pid=?';
  
    db.query(query, [productName,productDescription, productPrice,productQuantity,categoryId,suppliersId,productId], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ' + err.stack);
        res.status(500).send('Error adding product');
        return;
      }
  
      // After adding the product, fetch the updated list of products
      const searchQuery = 'SELECT * FROM product';
      db.query(searchQuery, (err, products) => {
        if (err) {
          console.error('Error executing MySQL query: ' + err.stack);
          res.status(500).send('Error fetching products');
          return;
        }
  
        // Render the index page with the updated list of products
        res.render('index', { message: 'Product Management', products:[] });
      });
    });
  });
  
app.post('/search', (req, res) => {
    const productId = req.body.productId;
    const query = 'SELECT * FROM product WHERE pid = ?';
  
    db.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ' + err.stack);
        res.status(500).send('Error searching for product');
        return;
      }
  
      res.render('index', { products: results });
    });
  });
  // app.get('/viewproduct', (req, res) => {
  //   res.render('viewproduct', { suppliers: [] }); // Render the index.ejs page with an empty array initially
  // });

  app.get('/viewproduct',(req,res) =>{
    let sql = 'SELECT * FROM product limit 25';

    let query = db.query(sql, (err, rows, fields)=>{
      if(!err){
        let sql1 = 'SELECT * FROM product' 
        let query1 = db.query(sql1, (err1, rows1, fields1)=>{
          if(!err1){
            let sql2 = 'SELECT * FROM categories'
            let query2 = db.query(sql2, (err2, rows2, fields2)=>{
              if(!err2){
                res.render('viewproduct.ejs',{
                  all_stocks:rows, brands:rows1, categories:rows2,  display_content:'None', filter_type:'None', filter_name:'None'
                    });
                }
              else
              console.log(err2)
            })
      
        }
        else
        console.log(err1)
      })
    }
      else
      console.log(err);
    });
  })

  app.post('/addcategory',(req,res) => {
    let sql = `INSERT INTO categorydb(Category) VALUES ('${req.body.new}') `
    let query = mysqlConnection.query(sql, (err, rows, fields) => {
      if(!err)
      {
        res.redirect('/categories')
      }
      else
      console.log(err)
  })
  })
  app.post('/submitstock',(req, res) => {
    console.log(req.body)
    var request1 = req.body

    var date_format = new Date();
    var transaction_date = date_format.getDate()+ '/'+ (parseInt(date_format.getMonth()+1)).toString() +'/'+date_format.getFullYear()
    console.log((parseInt(date_format.getMonth()+1)).toString())
    var transaction_time = date_format.getHours() + ':' + date_format.getMinutes() + ':' + date_format.getSeconds()
    let new_req = {};

      for (i in request1){
      if(i.includes("number") || i.includes("total")){
      delete i
      }
      else
      new_req[i] = request1[i]
      }
      
      const data = Object.entries(new_req).reduce((carry, [key, value]) => {
          const [text] = key.split(/\d+/);
          const index = key.substring(text.length) - 1;
          if (!Array.isArray(carry[index])) carry[index] = [];
          carry[index].push(value);
          return carry;
      }, []);

      // for (let i = 0; i < data.length; i++) {
      //   data[i].push(transaction_date);
      //   data[i].push(transaction_time);
      //   data[i].push(date_format.getDate())
      //   data[i].push(date_format.getMonth() + 1)
      //   data[i].push(date_format.getFullYear())
      //  }
      

    let sql = `INSERT INTO product (pid,pname,pdesc,price,quantity,categoryId,suppliersId) VALUES  ? `
    let query = db.query(sql,[ data], (err, rows, fields)=>{
      if(!err)
      {
      console.log('Successfully inserted values')
      res.redirect('/viewproduct')
      }
      else
      console.log(err);
    });
  })

  app.get('/stocks',(req,res)=>{
    let sql2 = 'SELECT * FROM categories'
    let query2 = db.query(sql2, (err2, rows2, fields2)=>{
      if(!err2){
        res.render('stocks.ejs',{
          categories:rows2,  display_content:'None', filter_type:'None', filter_name:'None'
            });
        }
      else
      console.log(err2)
    })
    // res.render('stocks', { products:[] });
  })

  app.post('/viewproducts', (req, res) => {
    let sql = 'SELECT * FROM product limit 25';


    let query = db.query(sql, (err, rows, fields)=>{
      if(!err){
        let sql1 = 'SELECT * FROM product' 
        let query1 = db.query(sql1, (err1, rows1, fields1)=>{
          if(!err1){
            let sql2 = 'SELECT * FROM categories'
            let query2 = db.query(sql2, (err2, rows2, fields2)=>{
              if(!err2){
                var selected_item = req.body['exampleRadios']
                if(selected_item == 'brand'){
                  var brand_name = req.body['selected_brand']
                  console.log(brand_name)
                  let sql3 = `SELECT * FROM product WHERE pname='${brand_name}'`
                  let query3 = db.query(sql3, (err3, rows3, fields3)=>{
                    if(!err3){
                      console.log(brand_name)
                      console.log(rows3);
                      res.render('viewproduct.ejs',{
                        all_stocks:rows, brands:rows1, categories:rows2, display_content:rows3, filter_type:'brand', filter_name:brand_name
                          });
                    } 
                    else
                    console.log(err3)
                  })
                }

                if(selected_item == 'category'){
                  var category_name = req.body['selected_category']
                  let sql3 = `select * from product p  where p.categoryId=(SELECT  categoryId FROM categories WHERE categoryname='${category_name}')`
                  let query3 = db.query(sql3, (err3, rows3, fields3)=>{
                    if(!err3){
                      console.log(rows3);
                      res.render('viewproduct.ejs',{
                        all_stocks:rows, brands:rows1, categories:rows2, display_content:rows3, filter_type:'category', filter_name:category_name
                          });
                    } 
                    else
                    console.log(err3)
                  })
                }
              }
              else
              console.log(err2)
            })
      
        }
        else
        console.log(err1)
      })
    }
      else
      console.log(err);
    });
  })




















  app.post('/allProducts', (req, res) => {
    const productId = req.body.productId;
    const query = 'SELECT * FROM product limit 25';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ' + err.stack);
        res.status(500).send('Error searching for product');
        return;
      }
  
      res.render('index', { products: results });
    });
  });

  app.get('/supplier', (req, res) => {
    res.render('supplier', { suppliers: [] }); // Render the index.ejs page with an empty array initially
  });

  app.post('/supplier', (req, res) => {
    const supplierId = req.body.supplierId;
    const query = 'SELECT * FROM suppliers WHERE suppliersId = ?';
    const query1 = 'select * from product where suppliersId=?';
    db.query(query, [supplierId], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ' + err.stack);
        res.status(500).send('Error searching for product');
        return;
      }
    
      db.query(query1, [supplierId], (err, products) => {
        if (err) {
          console.error('Error executing MySQL query: ' + err.stack);
          res.status(500).send('Error searching for product');
          return;
        }
      
        res.render('supplier', { suppliers: results ,products: products});
      });
    });
    });
  

  app.post('/allsuppliers', (req, res) => {

    const query = 'SELECT * FROM suppliers limit 25';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ' + err.stack);
        res.status(500).send('Error searching for product');
        return;
      }
  
      res.render('supplier', { suppliers: results, products:[] });
    });
  });


  app.post('/allorders', (req, res) => {
    
    const query = 'SELECT * FROM orders limit 25';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ' + err.stack);
        res.status(500).send('Error searching for product');
        return;
      }
  
      res.render('order', { orders: results , products: [], order:[]});
    });
  });


  app.get('/order', (req, res) => {
    res.render('order', { orders: [], products: [],order: [] });
  });
  




  app.post('/searchOrder', (req, res) => {
    const orderId = req.body.orderId;
    console.log(orderId);

    const orderQuery = 'SELECT * FROM orders WHERE orderid = ?';


    db.query(orderQuery, [orderId], (err, orderResults) => {
      if (err) {
       
        console.error('Error executing MySQL query: ' + err.stack);
        res.status(500).send('Error searching for order');
        return;
      }
  
     

        const order= orderResults[0];
        const productsQuery = 'SELECT * FROM product p JOIN contains c ON p.pid = c.pid WHERE c.orderid = ?';
  


        db.query(productsQuery, [orderId], (err, productResults) => {
          if (err) {
            console.error('Error executing MySQL query: ' + err.stack);
            res.status(500).send('Error fetching products for order');
            return;
          }
  
          const products = productResults || [];
      
          res.render('order', { order, products, orders : [] });


        });
      
   
    });
  });
  


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
