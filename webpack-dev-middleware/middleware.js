const path = require('path');
let mime = require('mime');
function wrapper({ fs, outputPath }) {
    return (req, res, next) => {
        let url = req.url;
        if(url === '/favicon.ico') return res.sendStatus(404);
        if(url === '/') url = "/index.html";
        let filename = path.join(outputPath, url);
        try {
            let stat = fs.statSync(filename);
            if (stat.isFile()) {
                let content = fs.readFileSync(filename);
                res.setHeader('Content-Type',mime.getType(filename));
                return res.send(content);
            }else{
               return  res.sendStatus(404);
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
}
module.exports = wrapper;
