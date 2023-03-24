var express = require('express');
var app = express();
var port = 8080;
let alert = require('alert');
var router = express.Router();
router.use(express.static(__dirname + "./public"))
const bodyParser = require('body-parser');
var multer = require('multer');
const expressHbs = require('express-handlebars');
app.use(express.static("public"))
var account = [];
var arraymyproduct = [];
var array = [
    { id_user: 1, email: 'foo@gmail.com', name: 'Nguyễn Văn A', password: 123, avatar: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg' },
    { id_user: 2, email: 'pele@gmail.com', name: 'Nguyễn Văn B', password: 123, avatar: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg' },
    { id_user: 3, email: 'em3b@gmail.com', name: 'Nguyễn Văn C', password: 123, avatar: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg' },
    { id_user: 4, email: 'cr7@gmail.com', name: 'Nguyễn Văn D', password: 123, avatar: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg' },
]
var array_product = [
    { id_pro: 1, name_pro: 'Sản phẩm 1', price: 10000, img: 'https://wallpapershome.com/images/pages/pic_h/21486.jpg', color: 'white', id_user: 1, name: 'Nguyễn Văn A' },
    { id_pro: 2, name_pro: 'Sản phẩm 2', price: 10000, img: 'https://wallpapershome.com/images/pages/pic_h/21486.jpg', color: 'white', id_user: 1, name: 'Nguyễn Văn A' },
    { id_pro: 3, name_pro: 'Sản phẩm 3', price: 10000, img: 'https://wallpapershome.com/images/pages/pic_h/21486.jpg', color: 'white', id_user: 2, name: 'Nguyễn Văn B' },
    { id_pro: 4, name_pro: 'Sản phẩm 4', price: 10000, img: 'https://wallpapershome.com/images/pages/pic_h/21486.jpg', color: 'white', id_user: 2, name: 'Nguyễn Văn B' },
];
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.hbs', expressHbs.engine({
    extname: "hbs",
}));
app.get('/', (req, res) => {
    res.render('home', { layout: 'main' });
});
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }))
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/uploads/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.toString())
    },

})
var upload = multer({ storage: storage });
app.post('/login', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    const email = req.body.email;
    const name = req.body.hoTen;
    const password = req.body.pass;
    const id_user = array.length + 1;
    const obj = { id_user, email, name, password, avatar: 'uploads/avatar/' + file.originalname.toString() };
    array.push(obj);
    res.render('home', { layout: 'main' });

})
const checkLogin = (email, pass) => {
    for (let index = 0; index < array.length; index++) {
        if (array[index].email == email && array[index].password == pass) {
            return 1;
        }
    }
}

app.post('/myproduct', upload.single('addProduct'), (req, res) => {

    if (req.body.id) {
        array_product = array_product.filter
            (product =>
                product.id_pro != req.body.id);
    } else {
        if (req.body.idproduct) {
            const editID = req.body.idproduct;
            const file = req.file
            array_product.map((product, index) => {
                if (product.id_pro == editID) {
                    array_product[index].name_pro = req.body.namepro;
                    array_product[index].price = req.body.pricepro;
                    array_product[index].color = req.body.color;
                    array_product[index].img = 'uploads/avatar/' + file.originalname.toString();
                }
            })
        } else {
            const file = req.file
            const name_pro = req.body.namepro;
            const price = req.body.pricepro;
            const color = req.body.color;
            const id_pro = array_product.length + 1;
            const obj = { id_pro, name_pro, price, img: 'uploads/avatar/' + file.originalname.toString(), color: color, id_user: account.id_user, name: account.name };
            array_product.push(obj);
        }
    }

    arraymyproduct = array_product.filter(i => i.id_user == account.id_user);
    res.render('home', { layout: 'myproduct', array_product: arraymyproduct });
})
app.post('/quanly', upload.single('updateProfile'), (req, res) => {
    if (req.body.hoTen) {
        const file = req.file
        for (let i = 0; i < array.length; i++) {
            if (array[i].id == account.id) {
                array[i].name = req.body.hoTen;
                array[i].avatar = 'uploads/avatar/' + file.originalname.toString();
                account = array.find(i => i.email == req.body.email && i.password == req.body.pass);
                res.render('home', { layout: 'quanly', array: array, array_product: array_product, account: account });
                break;
            }
        }
    } else if (req.body.search) {
        const obj = array.filter(i => i.name.includes(req.body.search));
        return res.render('home', { layout: 'quanly', array: obj, array_product: array_product, account: account });
    }
    else {
        if (checkLogin(req.body.email, req.body.pass) == 1) {

            account = array.find(i => i.email == req.body.email && i.password == req.body.pass);
            res.render('home', { layout: 'quanly', array: array, array_product: array_product, account: account });
        } else {
            res.redirect('/login');
            alert('Sai tài khoản hoặc mật khẩu')
        }
    }
})
app.get('/myproduct', (req, res) => {
    const arraymyproduct = array_product.filter(i => i.id_user == account.id_user);
    res.render('home', { layout: 'myproduct', array_product: arraymyproduct })
})
app.get('/quanly', (req, res) => {
    res.render('home', { layout: 'quanly', array: array, array_product: array_product, account: account });
})
app.get('/login', (req, res) => {
    account = [];
    arraymyproduct = [];
    res.render('home', { layout: 'main' });
});
app.get('/register', (req, res) => {
    res.render('home', { layout: 'register' });
});
app.get('/editprofile', (req, res) => {
    res.render('home', { layout: 'editprofile', account: account });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});