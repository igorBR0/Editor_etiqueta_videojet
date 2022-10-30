const { Console } = require('console');
var fs = require('fs');
const { send } = require('process');
const path = require('path');
const multer = require('multer');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
fs.existsSync("uploads") || fs.mkdirSync("uploads");
var xml2js = require('xml2js');

var extractedData0 = []
var extractedData1 = []

var nome = ""
const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/")

  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)

  }

})
const upload = multer({ storage })




//function (err, data) {
// if (err) console.log(err);

///console.log("successfully written our update xml to file");
//});

var express = require('express'),
  app = express();
  const port = process.env.PORT || 3000;
//app.use(express.static(__dirname + '/public'), bodyParser.json());
app.use(express.static(path.join(__dirname + '/public')), bodyParser.json());
app.engine('html', require('ejs').renderFile);
//app.set('views', path.join(__dirname, '/views'));
  app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//**OKK**//
//execute upload using post

app.post("/", upload.single("file"), (req, res) => {


  let archive_Name = req.file.filename;


  console.log(req.file.path)
  //var xml = fs.readFileSync(req.file.path, { encoding: 'utf16le' });
  var xml = fs.readFileSync(req.file.path, { encoding: 'utf16le' });
  console.log(req.file.path)
  const b = function () {
    var parser = new xml2js.Parser({ explicitArray: true });
    parser.parseString(xml, function (err, result) {
      for (i = 0; i < 25; i++) {
        //Nome
        extractedData0[i] = result.ImageDesign.SubImage[0].Field[i].$.Name;
        //dados
        extractedData1[i] = result.ImageDesign.SubImage[0].Field[i].CalcData;
      }
      //elementXML_nome = JSON.stringify(extractedData0)
      //elementXML_dados = JSON.stringify(extractedData1)
      app.post('/pageTAG', urlencodedParser, function (req, res) {



        //res.send(result.ImageDesign.SubImage[0].Field[9].CalcData = ;
        result.ImageDesign.SubImage[0].Field[9].CalcData = req.body.NomeProduto;
        result.ImageDesign.SubImage[0].Field[6].CalcData = req.body.codigoProduto;
        result.ImageDesign.SubImage[0].Field[4].CalcData = req.body.codigoGeral
        let nameArchive = req.body.Name_archive





        var builder = new xml2js.Builder({ xmldec: { version: '1.0', encoding: 'UTF-16',standalone:"yes" }});
        var xml_write = builder.buildObject(result);

        fs.writeFile(nameArchive, xml_write, function (err, data) {
          if (err) console.log(err);

          console.log("successfully written our update xml to file");
        });
        setTimeout(function () {
          var file = path.join(__dirname + "/" + nameArchive);
          res.download(file);

        }, 3000);
        // Set disposition and send it.
        // res.send('Downlaod feito');

      });

      elementXML_nome = extractedData0
      elementXML_dados = extractedData1

    })

    return [elementXML_nome, elementXML_dados]
  }
  console.log(b())
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")


  let name = ""

  name = b();
  let codigo;

  codigo = name[1][7]



  console.log(name[1][9])

  console.log(archive_Name)

  res.render(path.join(__dirname + '/pageTag'), { name, codigo2: codigo, archive_Name });





})
//render page upload
app.get("/", upload.single("file"), (req, res) => {

  res.render(path.join(__dirname + '/index'));

})


app.get('/download', function (req, res) {
  var file = path.join(__dirname + '/edited-test.xml');
  res.download(file); // Set disposition and send it.
});

//**//





app.listen(port)
