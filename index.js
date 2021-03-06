var express = require('express');
var app = express();
var cors = require('cors');
const puppeteer = require('puppeteer');
var fs = require('fs');

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));

app.post('/del',(req,res) =>{
    var name = req.body.name;
    console.log(name);
    fs.unlink(name, (err) => {
        if (err){
            console.log(err);
            res.send("error in deletion");
        } 
            
        console.log('deleted');
        res.send("deleted");
      });
})

app.post('/', (req, res) => {
    console.log(req.body);
    var url = req.body.url;
    var viewport = req.body.viewport
    console.log("url",url);
    var random = Math.floor((Math.random() * 100) + 1);
    var name = `${random}.png`
    console.log(name);
    switch(viewport){
        case "DESKTOP":
            var viewportValue = {
                width : 1280,
                height : 950
            }
            break;
        case "TAB":
            var viewportValue = {
                width : 768,
                height : 1024
            }
            break;
        case "MOBILE":
            var viewportValue = {
                width : 360,
                height : 640
            }
            break;
    }

    (async () => {
        try{
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox','--disable-setuid-sandbox']
              })
            const page = await browser.newPage();
            await page.goto(url);
            await page.setViewport(viewportValue);
            await page.screenshot({ path: name});
            await browser.close();
            res.send(name);
        }
        catch(e){
            console.log(e);
            res.send(false);

        }  

      })();
    
   
})


var PORT = process.env.PORT || 4200;
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
}); 