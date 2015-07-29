WebApp.connectHandlers.stack.splice(0,0,{
    route: '/inbound',
    handle: function (req,res, next) {
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            MailParser.parse(getEmailAddress(fields.from), JSON.parse(fields.envelope).to, JSON.parse(fields.envelope).from, fields.subject, fields.text, fields.html);
        });

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Success");
    }.future ()
});

function getEmailAddress(from) {
    var start = from.indexOf("<");

    if(start === -1) {
        return "";
    }

    var end = from.indexOf(">");

    if(end === -1) {
        return "";
    }

    return from.substring(start + 1, end);
}